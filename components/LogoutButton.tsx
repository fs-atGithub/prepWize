"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.action";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in"); // Redirect after logout
  };

  return (
    <Button className="btn-primary max-sm:w-full" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
