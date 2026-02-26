'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { fadeIn, sectionReveal, staggerContainer, viewportConfig } from '@/lib/motionPresets'
import ComplianceDisclaimer from '@/components/ComplianceDisclaimer'
import { heroImages } from '@/lib/heroImages'

const industryCategories = [
  {
    category: 'Tech & Digital Startups',
    businesses: [
      'SaaS (niche software tools)',
      'AI automation agencies',
      'No-code app development',
      'Cybersecurity consulting',
      'Data analytics services',
      'CRM customization services',
    ],
  },
  {
    category: 'Marketing, Media & Creative',
    businesses: [
      'Digital marketing agency',
      'Social media management',
      'Influencer marketing agency',
      'Content creation studios',
      'SEO consulting',
      'Email marketing services',
    ],
  },
  {
    category: 'Construction, Trades & Local Services',
    businesses: [
      'General contracting',
      'Home remodeling',
      'Roofing services',
      'Plumbing services',
      'Electrical contracting',
      'HVAC services',
    ],
  },
  {
    category: 'Real Estate & Property',
    businesses: [
      'Property management',
      'Airbnb management',
      'Real estate wholesaling',
      'Fix & flip operations',
      'Home staging services',
      'Inspection services',
    ],
  },
  {
    category: 'E-Commerce & Product Businesses',
    businesses: [
      'Private-label brands',
      'Dropshipping stores',
      'Amazon FBA brands',
      'Subscription box services',
      'Print-on-demand apparel',
      'Custom merch brands',
    ],
  },
  {
    category: 'Professional & Business Services',
    businesses: [
      'Bookkeeping services',
      'Accounting firms',
      'Tax prep services',
      'Payroll services',
      'Virtual CFO services',
      'Compliance consulting',
    ],
  },
]

const entityStructures = [
  {
    category: 'Individual / Unincorporated',
    structures: [
      'Sole Proprietorship',
      'Sole Proprietorship with DBA (Doing Business As / Fictitious Name)',
      'Independent Contractor (tax status, not a separate entity)',
      'Professional Sole Proprietorship (licensed professionals in some states)',
    ],
  },
  {
    category: 'Partnerships',
    structures: [
      'General Partnership (GP)',
      'Limited Partnership (LP)',
      'Limited Liability Partnership (LLP)',
      'Limited Liability Limited Partnership (LLLP) (state-specific)',
      'Professional Partnership (PP)',
    ],
  },
  {
    category: 'Limited Liability Companies (LLCs)',
    structures: [
      'Standard LLC',
      'Single-Member LLC',
      'Multi-Member LLC',
      'Series LLC (state-specific)',
      'Professional LLC (PLLC / P.C.C.)',
      'Manager-Managed LLC',
    ],
    disclaimer:
      'Entity availability and requirements vary by state. We guide you through the correct structure based on your business, industry, and location.',
  },
  {
    category: 'Corporations (For-Profit)',
    structures: [
      'C Corporation',
      'S Corporation (IRS tax election, not entity type)',
      'Professional Corporation (PC / P.C.)',
      'Professional Service Corporation (PSC)',
      'Close Corporation',
    ],
  },
  {
    category: 'Nonprofit & Tax-Exempt Entities',
    structures: [
      'Nonprofit Corporation',
      'Public Charity (501(c)(3))',
      'Private Foundation',
      'Religious Corporation',
      '501(c)(4) – Social Welfare Org',
      '501(c)(6) – Business League / Chamber',
    ],
  },
  {
    category: 'Holding & Complex Structures',
    structures: [
      'Holding Company (LLC or Corp)',
      'Operating Company (OpCo)',
      'Management Company',
      'Captive Insurance Company',
      'Special Purpose Vehicle (SPV / SPE)',
    ],
  },
]

export default function WhoWeServePage() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="relative bg-primary-900 py-20 md:py-28 overflow-hidden">
        <Image
          src={heroImages[3].src}
          alt={heroImages[3].alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary-950/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/45 via-primary-950/20 to-primary-900/70" />

        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionReveal}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400 mb-6">
                  Our Clients
                </p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-[1.1]">
                  Who we serve
                </h1>
              </div>
              <p className="text-lg text-neutral-300 leading-relaxed">
                We serve people who want to turn their ideas into reality — and those who have already built something meaningful.
                From first-time entrepreneurs to experienced business owners, inherited businesses, partnerships, and professional services.
              </p>
            </div>

            <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-3 gap-8">
              <div>
                <span className="font-serif text-3xl md:text-4xl text-white">200+</span>
                <p className="text-sm text-neutral-400 mt-1">Business Types Supported</p>
              </div>
              <div>
                <span className="font-serif text-3xl md:text-4xl text-white">78</span>
                <p className="text-sm text-neutral-400 mt-1">Entity Structures</p>
              </div>
              <div>
                <span className="font-serif text-3xl md:text-4xl text-white">50</span>
                <p className="text-sm text-neutral-400 mt-1">States Covered</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeIn} className="mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
              Industries & Business Types
            </p>
            <h2 className="heading-2 max-w-2xl">Representative industries we support</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="space-y-px bg-neutral-200"
          >
            {industryCategories.map((category) => (
              <motion.div
                key={category.category}
                variants={fadeIn}
                className="bg-white p-8 md:p-10"
              >
                <h3 className="heading-3 mb-6">{category.category}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                  {category.businesses.map((business) => (
                    <p key={business} className="text-sm text-neutral-600 py-1 flex items-center">
                      <span className="w-1 h-1 bg-primary-900 rounded-full mr-3 flex-shrink-0" />
                      {business}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-neutral-50 border-y border-neutral-200">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeIn} className="mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
              Entity Structures
            </p>
            <h2 className="heading-2 max-w-2xl">Core entity structures we help coordinate</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeIn}
            className="bg-white border border-neutral-200 p-6 mb-8"
          >
            <p className="text-sm text-neutral-600 leading-relaxed">
              <span className="font-medium text-primary-900">Note:</span> S-Corp and LLC taxed as S-Corp are tax elections, not new entities.
              Many structures overlap legally but differ by state statute, tax treatment, or licensing rules.
              Some entities (like L3C, Series LLC, Close Corporations) are state-restricted but federally recognized.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="space-y-px bg-neutral-200"
          >
            {entityStructures.map((category) => (
              <motion.div
                key={category.category}
                variants={fadeIn}
                className="bg-white p-8 md:p-10"
              >
                <h3 className="heading-3 mb-6">{category.category}</h3>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                  {category.structures.map((structure, idx) => (
                    <p key={structure} className="text-sm text-neutral-600 py-1 flex items-start">
                      <span className="text-xs text-neutral-400 font-medium min-w-[2rem] mt-px">{String(idx + 1).padStart(2, '0')}</span>
                      {structure}
                    </p>
                  ))}
                </div>
                {(category as any).disclaimer && (
                  <p className="mt-6 text-xs text-neutral-400 border-t border-neutral-100 pt-4">
                    {(category as any).disclaimer}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-primary-900 text-white">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeIn}
            className="max-w-2xl"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-6">
              Tell us about your business
            </h2>
            <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8">
              {"We'll"} understand your industry requirements and build infrastructure that fits
              your regulatory and operational needs.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-medium tracking-wide uppercase text-primary-900 bg-white border border-white hover:bg-neutral-100 transition-colors duration-200"
            >
              Schedule a Consultation
            </Link>
            <div className="mt-12">
              <ComplianceDisclaimer className="text-neutral-500" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
