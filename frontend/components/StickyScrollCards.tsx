'use client'

import { motion } from 'framer-motion'
import { fadeIn, staggerContainer, viewportConfig } from '@/lib/motionPresets'

const pillars = [
  {
    number: '01',
    title: 'Formation & Licensing',
    description:
      'From legal formation and licensing to multi-state registration — we build the structural foundation your business needs to operate with confidence across jurisdictions.',
    capabilities: ['Entity Formation', 'Multi-State Licensing', 'Registered Agent Services', 'Operating Agreements'],
  },
  {
    number: '02',
    title: 'Digital & Growth Infrastructure',
    description:
      'Professional websites, social media presence, email systems, and custom applications — built and managed as one coordinated system for sustained visibility and growth.',
    capabilities: ['Professional Websites', 'Social Media Infrastructure', 'Custom Applications', 'Email & Communication'],
  },
  {
    number: '03',
    title: 'AI Systems & Ongoing Compliance',
    description:
      'Custom AI tools, automated workflows, and proactive compliance monitoring — so your team focuses on scaling while we handle the operational backbone.',
    capabilities: ['AI Chatbots & Automation', 'Workflow Optimization', 'Compliance Monitoring', 'Annual Report Management'],
  },
]

const StickyScrollCards = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeIn}
          className="mb-16 md:mb-20"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
            Core Capabilities
          </p>
          <h2 className="heading-2 max-w-2xl">
            One team. One system. Complete business infrastructure.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200"
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.number}
              variants={fadeIn}
              className="bg-white p-8 md:p-10"
            >
              <span className="text-xs font-medium text-neutral-400 tracking-[0.15em]">
                {pillar.number}
              </span>
              <h3 className="heading-3 mt-3 mb-4">
                {pillar.title}
              </h3>
              <p className="body-regular mb-6">
                {pillar.description}
              </p>
              <ul className="space-y-2">
                {pillar.capabilities.map((cap) => (
                  <li key={cap} className="flex items-center text-sm text-neutral-500">
                    <span className="w-1 h-1 bg-primary-900 rounded-full mr-3 flex-shrink-0" />
                    {cap}
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

export default StickyScrollCards
