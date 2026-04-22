import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AIDoctorsSection from "@/components/AIDoctorsSection";
import FeaturesSection from "@/components/FeaturesSection";
import MidPageCTA from "@/components/MidPageCTA";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
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
