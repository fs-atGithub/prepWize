"use server";
import { cookies } from "next/headers";

import { db, auth } from "@/firebase/admin";

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000; // 1 week

// sign up
export const singUp = async (params: SignUpParams) => {
  const { uid, name, email, password } = params;

  try {
    const useRecord = await db.collection("users").doc(uid).get();
    if (useRecord.exists) {
      return {
        success: false,
        message: "User already exists",
      };
    }
    await db.collection("users").doc(uid).set({
      name,
      email,
      password,
      createdAt: new Date(),
    });
    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error: any) {
    console.error("Error creating a user:", error);
    if (error.code === "auth/email-already-in-exists") {
      return {
        success: false,
        message: "Email already exists",
      };
    }
    return {
      success: false,
      message: "Error creating an account",
    };
  }
};

// sign in
export const singIn = async (params: SignInParams) => {
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

// sign out
export const signOut = async () => {
  const cookieStore = await cookies();

  // Get the session cookie
  const sessionCookie = cookieStore.get("session")?.value;

  if (sessionCookie) {
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie);
      await auth.revokeRefreshTokens(decodedClaims.uid); // Invalidate session on Firebase
    } catch (error) {
      console.error("Error revoking session:", error);
    }
  }

  // Remove session cookie
  cookieStore.delete("session");

  return {
    success: true,
    message: "Signed out successfully",
  };
};

// set session cookie
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

// check if user is authenticated
export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) {
      return null;
    }
    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};
