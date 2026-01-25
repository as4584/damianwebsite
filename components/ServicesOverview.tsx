'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const services = [
  {
    title: 'Formation & Licensing',
    description: 'Complete LLC and nonprofit formation with all required licensing, multi-state filings, and EIN acquisition.',
    features: ['Entity structure & licensing', 'EIN & state registration', 'Multi-location compliance', 'Operating agreements'],
  },
  {
    title: 'Growth Infrastructure',
    description: 'Professional websites and social media presence managed to maximize your visibility and market growth.',
    features: ['High-visibility websites', 'Social media presence', 'Email infrastructure', 'Market expansion tools'],
  },
  {
    title: 'Scalable AI Systems',
    description: 'Custom AI tools and automation built to accelerate your scaling and support distributed operations.',
    features: ['Custom scalable apps', 'AI chatbots & receptionists', 'Workflow automation', 'Distributed team tools'],
  },
]

const ServicesOverview = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-2 mb-6"
          >
            Built for <span className="text-blue-600">Scaling</span> and <span className="text-blue-600">Growth</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="body-large"
          >
            From <span className="text-slate-900 font-semibold">licensing</span> and multi-location formation to social visibility and AI tools — engineered as one system
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="card-premium p-8 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-500"
            >
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">
                {service.title}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link href="/services" className="btn-primary">
            View All Services
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesOverview
