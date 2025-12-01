"use client"

import { NavigationMenu } from "@/components/menu/navigation"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NotiStackProvider from "@/providers/SnackNotification";
import ReactQuery from "@/providers/ReactQuery";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = true
  const userRole = "admin" as const
  const userName = "Uziel Estrada"
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQuery>
          <NotiStackProvider>
            <NavigationMenu isAuthenticated={isAuthenticated} userRole={userRole} userName={userName} />
            {children}
          </NotiStackProvider>
        </ReactQuery>
      </body>
    </html>
  );
}
