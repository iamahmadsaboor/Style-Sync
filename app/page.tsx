import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { HowItWorks } from '@/components/sections/how-it-works';
import { GallerySection } from '@/components/sections/gallery-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { FaqSection } from '@/components/sections/faq-section';
import { CtaSection } from '@/components/sections/cta-section';

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <GallerySection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}