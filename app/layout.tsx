import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Doctor Pro — AI-Powered Health Assistant",
  description:
    "Describe your symptoms and get guided care instantly. AI Doctor Pro is your 24/7 AI-powered health assistant — private, secure, and always available.",
  keywords: ["AI doctor", "health assistant", "symptom checker", "online consultation", "AI health"],
  openGraph: {
    title: "AI Doctor Pro — AI-Powered Health Assistant",
    description:
      "Describe your symptoms and get guided care instantly. Private, secure, and available 24/7.",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

import SyncProfile from "@/components/auth/SyncProfile";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full scroll-smooth antialiased`}>
        <body className="min-h-full flex flex-col bg-white">
          <SyncProfile />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
