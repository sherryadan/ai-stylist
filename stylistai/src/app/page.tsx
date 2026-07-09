import Hero from "@/components/home/hero";
import PartnerLogos from "@/components/home/partner-logos";
import HowItWorks from "@/components/home/how-it-works";
import OccasionsGrid from "@/components/home/occasions-grid";
import BrandsShowcase from "@/components/home/brands-showcase";
import Stats from "@/components/home/stats";
import Testimonials from "@/components/home/testimonials";
import CtaSection from "@/components/home/cta-section";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <PartnerLogos />
      <HowItWorks />
      <OccasionsGrid />
      <Stats />
      <BrandsShowcase />
      <Testimonials />
      <CtaSection />
    </div>
  );
}
