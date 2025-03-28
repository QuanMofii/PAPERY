import { Header } from "@/app/[locale]/(home)/components/header"
import { Footer } from "@/app/[locale]/(home)/components/footer"
import { HeroSection } from "@/app/[locale]/(home)/components/hero-section"
import { FeaturesSection } from "@/app/[locale]/(home)/components/features-section"
import { HowItWorksSection } from "@/app/[locale]/(home)/components/how-it-works-section"
import { PricingSection } from "@/app/[locale]/(home)/components/pricing-section"
import { FaqSection } from "@/app/[locale]/(home)/components/faq-section"
import { CtaSection } from "@/app/[locale]/(home)/components/cta-section"
import { NewsletterSection } from "@/app/[locale]/(home)/components/newsletter-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
