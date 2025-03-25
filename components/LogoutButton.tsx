"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { signOut, getCurrentUser } from "@/lib/actions/auth.action";

export const LogoutButton = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserName(user.name); // Extract the name directly from user data
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in"); // Redirect after logout
  };

  return (
    <Button className="btn-primary max-sm:w-full" onClick={handleLogout}>
      {userName ? `Logout ${userName}` : "Logout"}
    </Button>
  );
};

export default LogoutButton;
