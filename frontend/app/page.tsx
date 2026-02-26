import Hero from '@/components/Hero'
import CredibilityBar from '@/components/CredibilityBar'
import StickyScrollCards from '@/components/StickyScrollCards'
import ServicesOverview from '@/components/ServicesOverview'
import CTASection from '@/components/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <CredibilityBar />
      <StickyScrollCards />
      <ServicesOverview />
      <CTASection />
    </>
  )
}
