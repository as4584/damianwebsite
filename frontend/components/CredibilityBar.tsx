'use client'

import { motion } from 'framer-motion'

const sectors = [
  'Technology',
  'Professional Services',
  'Healthcare',
  'Real Estate',
  'Retail & E-Commerce',
  'Nonprofit',
  'Construction',
  'Finance',
]

const CredibilityBar = () => {
  return (
    <section className="py-16 md:py-20 bg-neutral-50 border-y border-neutral-200">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 text-center mb-10">
            Experience Across Industries &amp; Sectors
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 md:gap-x-16">
            {sectors.map((sector) => (
              <span
                key={sector}
                className="text-sm md:text-base font-medium text-neutral-400 tracking-wide"
              >
                {sector}
              </span>
            ))}
          </div>

          <p className="text-[10px] text-neutral-400 text-center mt-8 max-w-lg mx-auto">
            Sectors listed represent industries served. They do not imply endorsement or partnership with any specific organization.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default CredibilityBar
