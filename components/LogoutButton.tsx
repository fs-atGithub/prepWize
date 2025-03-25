import { Button } from "@/components/ui/button";
import { signOut, getCurrentUser } from "@/lib/actions/auth.action";

export const LogoutButton = async () => {
  const user = await getCurrentUser();
  const userName = user?.name || null; // Extract name directly during component render

  const handleLogout = async () => {
    "use server"; // Mark this function to run on the server
    await signOut();
  };

  return (
    <Button className="btn-primary max-sm:w-full" onClick={handleLogout}>
      {userName ? `Logout ${userName}` : "Logout"}
    </Button>
  );
};

export default LogoutButton;
