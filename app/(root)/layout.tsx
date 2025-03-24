import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

import LogoutButton from "@/components/LogoutButton"; // Import the Logout Button
import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    redirect("/sign-in");
  }

  return (
    <div className={"root-layout"}>
      <nav className={"flex justify-between items-center p-4"}>
        <Link href="/" className={"flex items-center gap-2"}>
          <Image
            src={"/logo.svg"}
            alt={"prepWise logo"}
            width={38}
            height={32}
          />
          <h2 className={"text-primary-100"}>PrepWise</h2>
        </Link>
        <LogoutButton />
      </nav>
      {children}
    </div>
  );
};

export default Layout;
