import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";

import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { NavBar } from "@/components/nav-bar";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Nextjs & Clerk",
  description: "Nextjs, clerk, drizzle & PSQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in">
      <html
        lang="en"
        className={cn(
          "h-full",
          "antialiased",
          "font-mono",
          jetbrainsMono.variable,
        )}
      >
        <body className="min-h-full flex flex-col">
          <NavBar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
