'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeIn, staggerContainer, viewportConfig } from '@/lib/motionPresets'

const services = [
  {
    title: 'Formation & Licensing',
    description: 'Complete LLC and nonprofit formation with all required licensing, multi-state filings, and EIN acquisition.',
    features: ['Entity structure & licensing', 'EIN & state registration', 'Multi-location compliance', 'Operating agreements'],
  },
  {
    title: 'Growth Infrastructure',
    description: 'Professional websites and social media presence managed to maximize your visibility and market growth.',
    features: ['Professional websites', 'Social media presence', 'Email infrastructure', 'Market expansion tools'],
  },
  {
    title: 'Scalable AI Systems',
    description: 'Custom AI tools and automation built to accelerate your scaling and support distributed operations.',
    features: ['Custom applications', 'AI chatbots & receptionists', 'Workflow automation', 'Distributed team tools'],
  },
]

const ServicesOverview = () => {
  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeIn}
          className="mb-16"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
            Service Domains
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="heading-2 max-w-xl">
              Built for scaling and growth
            </h2>
            <Link href="/services" className="btn-secondary text-xs">
              View All Services
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={fadeIn}
              className="bg-white p-8 md:p-10 hover:bg-neutral-50 transition-colors duration-200"
            >
              <h3 className="heading-3 mb-4">
                {service.title}
              </h3>
              <p className="body-regular mb-6">
                {service.description}
              </p>
              <ul className="space-y-2.5">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-neutral-500">
                    <span className="w-1 h-1 bg-primary-900 rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesOverview
