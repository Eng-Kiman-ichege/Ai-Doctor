"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AIDoctorsSection from "@/components/AIDoctorsSection";
import FeaturesSection from "@/components/FeaturesSection";
import MidPageCTA from "@/components/MidPageCTA";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/consultation");
    }
  }, [isLoaded, isSignedIn]);

  // Show nothing while checking auth to avoid flash
  if (!isLoaded || isSignedIn) return null;

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <AIDoctorsSection />
      <FeaturesSection />
      <MidPageCTA />
      <FinalCTA />
      <Footer />
    </main>
  );
}
