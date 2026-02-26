'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeIn, staggerContainer, viewportConfig } from '@/lib/motionPresets'
import ComplianceDisclaimer from '@/components/ComplianceDisclaimer'

const values = [
  {
    title: 'Systems Built for Scaling',
    description: 'We build business infrastructure with the future in mind. Formation, licensing, websites, and custom AI — coordinated to handle growth without breaking.',
  },
  {
    title: 'No Vendor Roadblocks',
    description: 'Avoid the friction of multiple agencies. We handle the technical, legal, and creative infrastructure in-house so you can scale faster.',
  },
  {
    title: 'Multi-State Stability',
    description: 'National growth comes with compliance complexity. We build systems that remain stable and compliant as you expand across state lines.',
  },
  {
    title: 'Growth & Visibility',
    description: 'Structure without visibility is wasted potential. We integrate social media presence and digital growth strategies into your core operations.',
  },
]

const stats = [
  { number: '1,000+', label: 'Infrastructure Systems Deployed' },
  { number: '50', label: 'States Served' },
  { number: 'Unified', label: 'Growth Architecture' },
  { number: 'Full-Stack', label: 'Infrastructure Platform' },
]

export default function AboutPage() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="bg-primary-900 py-20 md:py-28">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400 mb-6">
              About the Firm
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-[1.1] mb-6">
              Engineered for growth and multi-location scaling
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl">
              Innovation Business Development Solutions is a national business infrastructure firm. 
              We assemble the legal, technical, and digital infrastructure your business needs to grow — as one coordinated system.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-white border-b border-neutral-200">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeIn} className="text-center md:text-left">
                <div className="text-3xl md:text-4xl font-serif text-primary-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-neutral-500 uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeIn}>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
                  Our Approach
                </p>
                <h2 className="heading-2">
                  Why we exist
                </h2>
              </motion.div>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              variants={fadeIn}
              className="lg:col-span-8 space-y-6 text-base md:text-lg text-neutral-600 leading-relaxed"
            >
              <p>
                Most businesses are built in pieces. Formation through a lawyer. Website through 
                a designer. Visibility through a marketing agency. Compliance through an accountant. 
                All separate. All disconnected.
              </p>
              <p>
                When you try to scale, these gaps become roadblocks. Vendor handoffs fail. 
                Multi-state licensing gets missed. Social presence doesn{"'"}t match the operations. 
                And when you hit your next growth milestone, the infrastructure collapses because 
                no one owns the complete picture.
              </p>
              <p>
                We started Innovation Business Development Solutions to fix this. We build comprehensive growth 
                infrastructure — from formation and multi-state licensing to scalable AI tools and 
                digital visibility — all coordinated by one team. No handoffs. No gaps. 
                One system engineered for expansion.
              </p>
              <p>
                This isn{"'"}t just about getting started; it{"'"}s about being prepared for what comes next. 
                When your business infrastructure is built as one system, everything works together 
                to support your bottom line. That is what we build.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-neutral-50 border-y border-neutral-200">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeIn} className="mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
              Operating Principles
            </p>
            <h2 className="heading-2 max-w-xl">How we operate</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-px bg-neutral-200"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeIn}
                className="bg-white p-8 md:p-10"
              >
                <h3 className="heading-3 mb-3">{value.title}</h3>
                <p className="body-regular">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
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
              Tell us what {"you're"} building. {"We'll"} handle the structure and systems.
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
