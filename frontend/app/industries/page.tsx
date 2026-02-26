'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { fadeIn, sectionReveal, staggerContainer, viewportConfig } from '@/lib/motionPresets'
import ComplianceDisclaimer from '@/components/ComplianceDisclaimer'
import { heroImages } from '@/lib/heroImages'

const industries = [
  {
    title: 'Technology Startups',
    description: 'Complete infrastructure for software companies, SaaS platforms, and tech ventures.',
    needs: [
      'Fast entity formation',
      'Custom web applications',
      'AI tool integration',
      'Scalable digital infrastructure',
    ],
  },
  {
    title: 'Professional Services',
    description: 'Infrastructure for consultants, agencies, and service-based businesses.',
    needs: [
      'Professional websites',
      'Client management systems',
      'Email and communication tools',
      'Compliance coordination',
    ],
  },
  {
    title: 'Retail & E-commerce',
    description: 'Complete systems for online and brick-and-mortar retail operations.',
    needs: [
      'E-commerce platforms',
      'Inventory management',
      'Payment processing integration',
      'Multi-location setup',
    ],
  },
  {
    title: 'Healthcare & Wellness',
    description: 'HIPAA-aware infrastructure for medical practices and wellness businesses.',
    needs: [
      'Secure patient systems',
      'Appointment scheduling',
      'Compliance-focused setup',
      'Professional communication',
    ],
  },
  {
    title: 'Nonprofit Organizations',
    description: 'Complete infrastructure for 501(c)(3) and other nonprofit entities.',
    needs: [
      '501(c)(3) formation',
      'Donor management systems',
      'Grant tracking tools',
      'Ongoing compliance support',
    ],
  },
  {
    title: 'Real Estate',
    description: 'Systems for property management, brokerages, and real estate investment firms.',
    needs: [
      'Property management software',
      'Client portals',
      'Document management',
      'Multi-entity coordination',
    ],
  },
]

const representativeEngagements = [
  {
    sector: 'SaaS Startup',
    challenge: 'Needed formation, website, custom app, and AI chatbot — all coordinated quickly.',
    approach: 'Built complete infrastructure in 3 weeks. Formation, custom domain, application platform, and AI support system deployed as one.',
    outcome: '100% operational from day one. No vendor handoffs.',
  },
  {
    sector: 'Professional Services Firm',
    challenge: 'Multiple locations, inconsistent systems, compliance gaps.',
    approach: 'Unified all locations under one infrastructure system. Coordinated state filings, built central website, deployed communication tools.',
    outcome: 'One system. No gaps. Complete visibility.',
  },
  {
    sector: 'Nonprofit Organization',
    challenge: '501(c)(3) application, donor management, and website needed simultaneously.',
    approach: 'Handled nonprofit formation, built donor portal, deployed professional website — all managed as one project.',
    outcome: 'Operational before first fundraising event.',
  },
]

export default function IndustriesPage() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative bg-primary-900 py-20 md:py-28 overflow-hidden">
        <Image
          src={heroImages[6].src}
          alt={heroImages[6].alt}
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
                  Industries
                </p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-[1.1]">
                  Sector-specific infrastructure
                </h1>
              </div>
              <p className="text-lg text-neutral-300 leading-relaxed">
                Every industry has different infrastructure needs. We build complete systems
                tailored to how your business actually operates.
              </p>
            </div>

            {/* National Reach Stats */}
            <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-3 gap-8">
              <div>
                <span className="font-serif text-3xl md:text-4xl text-white">50</span>
                <p className="text-sm text-neutral-400 mt-1">States Served</p>
              </div>
              <div>
                <span className="font-serif text-3xl md:text-4xl text-white">Multi-State</span>
                <p className="text-sm text-neutral-400 mt-1">Registration Support</p>
              </div>
              <div>
                <span className="font-serif text-3xl md:text-4xl text-white">National</span>
                <p className="text-sm text-neutral-400 mt-1">Compliance Coordination</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200"
          >
            {industries.map((industry) => (
              <motion.div
                key={industry.title}
                variants={fadeIn}
                className="bg-white p-8 md:p-10 hover:bg-neutral-50 transition-colors duration-200"
              >
                <h3 className="heading-3 mb-3">{industry.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                  {industry.description}
                </p>
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-[0.15em] mb-3">
                  Common Needs
                </p>
                <ul className="space-y-2">
                  {industry.needs.map((need) => (
                    <li key={need} className="flex items-center text-sm text-neutral-600">
                      <span className="w-1 h-1 bg-primary-900 rounded-full mr-3 flex-shrink-0" />
                      {need}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Representative Engagements */}
      <section className="section-padding bg-neutral-50 border-y border-neutral-200">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeIn}
            className="mb-16"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
              Representative Engagements
            </p>
            <h2 className="heading-2 max-w-xl">How we build complete systems</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="space-y-px bg-neutral-200"
          >
            {representativeEngagements.map((study) => (
              <motion.div
                key={study.sector}
                variants={fadeIn}
                className="bg-white p-8 md:p-12"
              >
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-[0.15em] mb-4">
                  {study.sector}
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-xs font-medium text-primary-900 uppercase tracking-[0.1em] mb-2">
                      Challenge
                    </h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-primary-900 uppercase tracking-[0.1em] mb-2">
                      Approach
                    </h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">{study.approach}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-primary-900 uppercase tracking-[0.1em] mb-2">
                      Outcome
                    </h4>
                    <p className="text-sm text-neutral-700 font-medium leading-relaxed">{study.outcome}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-xs text-neutral-400 mt-6">
            The engagements above are representative of work performed and do not constitute guarantees of future results.
          </p>
        </div>
      </section>

      {/* CTA Section */}
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
              Let us build your infrastructure
            </h2>
            <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8">
              No matter your industry, we build complete business systems tailored to your operations.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-medium tracking-wide uppercase text-primary-900 bg-white border border-white hover:bg-neutral-100 transition-colors duration-200"
            >
              Discuss Your System
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
