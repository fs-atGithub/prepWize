"use server";
import { cookies } from "next/headers";

import { db, auth } from "@/firebase/admin";

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000; // 1 week

// Sign up
export const signUp = async (params: SignUpParams) => {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
      createdAt: new Date(), // Secure: No plain passwords stored
    });

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message:
        error.code === "auth/email-already-in-use"
          ? "Email already exists"
          : "Error creating an account",
    };
  }
};

// Sign in
export const signIn = async (params: SignInParams) => {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await setSessionCookie(idToken);
    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error: any) {
    console.error("Error signing in:", error);
    return {
      success: false,
      message: "Error signing in",
    };
  }
};

// Sign out
export const signOut = async () => {
  const cookieStore = await cookies();

  try {
    const sessionCookie = cookieStore.get("session")?.value;

    if (sessionCookie) {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie);
      await auth.revokeRefreshTokens(decodedClaims.uid); // Invalidate Firebase session
    }

    cookieStore.delete("session");

    return {
      success: true,
      message: "Signed out successfully",
    };
  } catch (error) {
    console.error("Error signing out:", error);
    return {
      success: false,
      message: "Error signing out",
    };
  }
};

// Set session cookie
export const setSessionCookie = async (idToken: string) => {
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK,
  });

  cookieStore.set("session", sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_WEEK,
    path: "/",
    sameSite: "lax",
  });
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) return null;

    const userData = userRecord.data();

    return {
      ...userData,
      id: userRecord.id,
      createdAt: userData?.createdAt?.toDate().toISOString() || null, // Ensure serializable format
    } as unknown as User;
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
};

// Check authentication status
export const isAuthenticated = async (): Promise<boolean> => {
  return !!(await getCurrentUser());
};
