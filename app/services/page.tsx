'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

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
    step: 1,
    title: 'Discovery',
    description: "We learn what you're building, what systems you need, and what infrastructure gaps exist.",
  },
  {
    step: 2,
    title: 'System Design',
    description: 'We design your complete business infrastructure — formation, websites, apps, compliance, and tools.',
  },
  {
    step: 3,
    title: 'Build & Deploy',
    description: 'We build and deploy everything as one coordinated system, not separate vendor projects.',
  },
  {
    step: 4,
    title: 'Ongoing Support',
    description: 'We maintain your infrastructure, handle compliance, and support your business as it grows.',
  },
]

export default function ServicesPage() {
  return (
    <div className="pt-20 md:pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-neutral-50 to-white py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="heading-1 mb-6"
            >
              Scalable Growth Infrastructure
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              Formation. Licensing. Growth Systems. AI Automation. Compliance. 
              Everything your business needs to scale — built and managed as one system.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-50 rounded-2xl p-8 md:p-12 lg:p-16"
              >
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div>
                    <div className="inline-block px-4 py-1 bg-white rounded-full mb-4">
                      <span className="text-sm font-medium text-neutral-600">
                        {service.pricing}
                      </span>
                    </div>
                    <h2 className="heading-3 mb-4">{service.title}</h2>
                    <p className="body-regular mb-6">{service.longDescription}</p>
                    <Link href="/contact" className="btn-primary">
                      Discuss Your Needs
                    </Link>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-neutral-900">
                      {"What's"} Included
                    </h3>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-neutral-900 mr-3 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-neutral-700">{feature}</span>
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
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="heading-2 mb-6"
            >
              How We Build Your System
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              A coordinated approach to building complete business infrastructure
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-neutral-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                  {step.title}
                </h3>
                <p className="text-neutral-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-neutral-900 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="heading-2 mb-6"
            >
              Let Us Build Your Business System
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-300 mb-8"
            >
              Tell us what {"you're"} building. {"We'll"} design and deploy the infrastructure you need.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-neutral-900 bg-white hover:bg-neutral-100 transition-colors duration-200"
              >
                Schedule a Consultation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
