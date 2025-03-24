import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interview question platform",
  description: "The only interview question platform you'll ever need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={"dark"}>
      <body className={`${monaSans.className}  antialiased pattern`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
