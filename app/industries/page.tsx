'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

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

const caseStudies = [
  {
    industry: 'SaaS Startup',
    challenge: 'Needed formation, website, custom app, and AI chatbot — all coordinated quickly.',
    solution: 'Built complete infrastructure in 3 weeks. Formation, custom domain, application platform, and AI support system deployed as one.',
    result: '100% operational from day one. No vendor handoffs.',
  },
  {
    industry: 'Professional Services Firm',
    challenge: 'Multiple locations, inconsistent systems, compliance gaps.',
    solution: 'Unified all locations under one infrastructure system. Coordinated state filings, built central website, deployed communication tools.',
    result: 'One system. No gaps. Complete visibility.',
  },
  {
    industry: 'Nonprofit Organization',
    challenge: '501(c)(3) application, donor management, and website needed simultaneously.',
    solution: 'Handled nonprofit formation, built donor portal, deployed professional website — all managed as one project.',
    result: 'Operational before first fundraising event.',
  },
]

export default function IndustriesPage() {
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
              Industries We Serve
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              Every industry has different infrastructure needs. We build complete systems 
              tailored to how your business actually operates.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold mb-4 text-neutral-900">
                  {industry.title}
                </h3>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {industry.description}
                </p>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
                    Common Needs
                  </h4>
                  <ul className="space-y-2">
                    {industry.needs.map((need) => (
                      <li key={need} className="flex items-start text-sm">
                        <svg
                          className="w-4 h-4 text-neutral-900 mr-2 mt-0.5 flex-shrink-0"
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
                        <span className="text-neutral-600">{need}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
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
              How We Build Complete Systems
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              Real infrastructure projects across different industries
            </motion.p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.industry}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 md:p-10"
              >
                <div className="inline-block px-3 py-1 bg-neutral-100 rounded-full mb-4">
                  <span className="text-sm font-medium text-neutral-700">
                    {study.industry}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-2">
                      Challenge
                    </h4>
                    <p className="text-neutral-700">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-2">
                      Solution
                    </h4>
                    <p className="text-neutral-700">{study.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-2">
                      Result
                    </h4>
                    <p className="text-neutral-700 font-medium">{study.result}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* National Reach Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="heading-2 mb-6">National Infrastructure Firm</h2>
              <p className="body-large">
                We serve businesses across all 50 states. Multi-state registration, 
                distributed operations, and national compliance — all coordinated as one system.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <div className="text-center p-6 bg-neutral-50 rounded-xl">
                <div className="text-4xl font-bold text-neutral-900 mb-2">50</div>
                <div className="text-neutral-600">States Served</div>
              </div>
              <div className="text-center p-6 bg-neutral-50 rounded-xl">
                <div className="text-4xl font-bold text-neutral-900 mb-2">Multi-State</div>
                <div className="text-neutral-600">Registration Support</div>
              </div>
              <div className="text-center p-6 bg-neutral-50 rounded-xl">
                <div className="text-4xl font-bold text-neutral-900 mb-2">National</div>
                <div className="text-neutral-600">Compliance Coordination</div>
              </div>
            </motion.div>
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
              Let Us Build Your Infrastructure
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-300 mb-8"
            >
              No matter your industry, we build complete business systems tailored to your operations.
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
                Discuss Your System
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
