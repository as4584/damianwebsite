'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { fadeIn, sectionReveal, staggerContainer, viewportConfig } from '@/lib/motionPresets'
import ComplianceDisclaimer from '@/components/ComplianceDisclaimer'
import { heroImages } from '@/lib/heroImages'

const services = [
  {
    id: 'formation',
    title: 'Formation & Licensing',
    description: 'Complete multi-state entity formation and licensing coordination for local and national scaling.',
    longDescription: 'Scaling requires a solid legal foundation. We handle complex entity selection, multi-state registration, professional licensing acquisition, and coordination for businesses ready to expand across domestic jurisdictions.',
    features: [
      'Multi-state LLC/Nonprofit formation',
      'Professional licensing coordination',
      'Foreign qualification filings',
      'Operating agreement preparation',
      'Federal EIN & Tax IDs',
      'Registered agent services',
    ],
    pricing: 'Custom pricing',
  },
  {
    id: 'websites',
    title: 'Growth Infrastructure',
    description: 'High-performance digital presence and social visibility systems built to scale with your brand.',
    longDescription: 'Visibility is the engine of growth. We build conversion-optimized websites and social media infrastructure that act as a unified system, ensuring your brand remains professional as you expand.',
    features: [
      'Conversion-focused development',
      'Social media infrastructure setup',
      'Domain and DNS scaling',
      'SSL and advanced security',
      'Automated digital assets',
      'Performance analytics integration',
    ],
    pricing: 'Custom pricing',
  },
  {
    id: 'applications',
    title: 'Custom Applications',
    description: 'Proprietary software and apps engineered to handle increased operational complexity as you grow.',
    longDescription: 'Manual processes break at scale. We build bespoke software that automates your unique workflows, allowing you to manage more locations and higher volume without increasing overhead.',
    features: [
      'Scalable web applications',
      'Mobile app development',
      'Enterprise API integrations',
      'Database architecture',
      'Multi-user permission systems',
      'Operational dashboards',
    ],
    pricing: 'Custom pricing',
  },
  {
    id: 'ai-tools',
    title: 'Scalable AI Systems',
    description: 'Next-generation AI chatbots, receptionists, and automation that replace manual labor.',
    longDescription: 'AI is the key to scaling without hiring. We deploy AI-powered infrastructure to handle customer support, sales inquiries, and call routing across your entire multi-location operation.',
    features: [
      'Multi-channel AI chatbots',
      '24/7 AI receptionist systems',
      'Automated lead qualification',
      'Voice AI integration',
      'CRM process automation',
      'Ongoing model optimization',
    ],
    pricing: 'Custom pricing',
  },
  {
    id: 'email',
    title: 'Digital Communication',
    description: 'Hardened email and communication systems designed for distributed teams and national operations.',
    longDescription: 'Communication failure is a growth killer. We implement professional, secure, and unified communication systems that allow your team to operate seamlessly regardless of location.',
    features: [
      'Secure enterprise email',
      'Distributed team protocols',
      'DMARC/SPF security setup',
      'Unified cloud directories',
      'Encrypted internal comms',
      'Digital asset management',
    ],
    pricing: 'Custom pricing',
  },
  {
    id: 'compliance',
    title: 'Licensing & Compliance',
    description: 'Ongoing monitoring of licenses, renewals, and legal obligations across all operational states.',
    longDescription: 'Expansion brings regulation. We proactively monitor your licensing renewals, annual report deadlines, and state-specific compliance requirements so your growth remains uninterrupted.',
    features: [
      'Proactive license renewals',
      'Annual report management',
      'Multi-state compliance audits',
      'Secretary of State monitoring',
      'Document retention systems',
      'Growth consulting & support',
    ],
    pricing: 'Annual plans available',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Discovery',
    description: "We learn what you're building, what systems you need, and what infrastructure gaps exist.",
  },
  {
    step: '02',
    title: 'System Design',
    description: 'We design your complete business infrastructure — formation, websites, apps, compliance, and tools.',
  },
  {
    step: '03',
    title: 'Build & Deploy',
    description: 'We build and deploy everything as one coordinated system, not separate vendor projects.',
  },
  {
    step: '04',
    title: 'Ongoing Support',
    description: 'We maintain your infrastructure, handle compliance, and support your business as it grows.',
  },
]

export default function ServicesPage() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative bg-primary-900 py-20 md:py-28 overflow-hidden">
        <Image
          src={heroImages[2].src}
          alt={heroImages[2].alt}
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
            className="max-w-3xl"
          >
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400 mb-6">
              Services
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-[1.1] mb-6">
              Scalable growth infrastructure
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl">
              Formation. Licensing. Growth Systems. AI Automation. Compliance. 
              Everything your business needs to scale — built and managed as one system.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-px bg-neutral-200">
            {services.map((service) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                variants={fadeIn}
                className="bg-white"
              >
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 p-8 md:p-12 lg:p-16">
                  <div>
                    <span className="text-xs font-medium text-neutral-400 uppercase tracking-[0.15em]">
                      {service.pricing}
                    </span>
                    <h2 className="heading-3 mt-2 mb-4">{service.title}</h2>
                    <p className="body-regular">{service.longDescription}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-[0.15em] mb-4">
                      Included
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-neutral-600">
                          <span className="w-1 h-1 bg-primary-900 rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-neutral-50 border-y border-neutral-200">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeIn} className="mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
              Methodology
            </p>
            <h2 className="heading-2 max-w-xl">How we build your system</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200"
          >
            {processSteps.map((step) => (
              <motion.div key={step.step} variants={fadeIn} className="bg-white p-8">
                <span className="text-xs font-medium text-neutral-400 tracking-[0.15em]">
                  {step.step}
                </span>
                <h3 className="heading-3 mt-2 mb-3">{step.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-primary-900 text-white">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeIn} className="max-w-2xl">
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-6">
              Let us build your business system
            </h2>
            <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8">
              Tell us what {"you're"} building. {"We'll"} design and deploy the infrastructure you need.
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
