import Hero from '@/components/Hero'
import StickyScrollCards from '@/components/StickyScrollCards'
import ServicesOverview from '@/components/ServicesOverview'
import CTASection from '@/components/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <StickyScrollCards />
      <ServicesOverview />
      <CTASection />
    </>
  )
}
