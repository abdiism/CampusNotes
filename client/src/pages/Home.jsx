import React from "react";
import HeroSection from "../components/landing/HeroSection";       // Import Hero
import BenefitsSection from "../components/landing/BenefitsSection"; // Import Benefits
import TestimonialsSection from "../components/landing/TestimonialsSection";
// Other sections are assumed deleted or commented out
 import FeaturesSection from "../components/landing/FeaturesSection";
import FAQSection from "../components/landing/FAQSection"; // Import FAQ
import Footer from "../components/Footer"; // Import Footer
import HowItWorksSection from "../components/landing/HowItWorksSection";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
          <HeroSection />      {/* Render Hero */}
          <BenefitsSection />  {/* Render Benefits */}
          <FeaturesSection />  {/* Render Features */}
          <HowItWorksSection /> {/* Render How It Works */}
          <TestimonialsSection /> {/* Render Testimonials */} 
          <FAQSection />      {/* Render FAQ */}
          <Footer />         {/* Render Footer */}  
         
          {/* Other sections are removed */}
      </main>
    </div>
  );
};

export default Home;