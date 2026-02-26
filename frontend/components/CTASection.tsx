'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeIn, viewportConfig } from '@/lib/motionPresets'

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 bg-primary-900 text-white">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeIn}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-6">
            Ready to scale your business system?
          </h2>
          <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-10">
            Tell us about your growth goals. We handle the formation, infrastructure, 
            and multi-state licensing so you can focus on scaling.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-10 py-4 text-sm font-medium tracking-wide uppercase text-primary-900 bg-white border border-white hover:bg-neutral-100 transition-colors duration-200"
          >
            Schedule a Consultation
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
