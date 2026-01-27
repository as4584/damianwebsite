'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-24 md:pt-28 overflow-hidden">
      {/* Ambient blue glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-blue-50/30 to-purple-50/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl" />
      
      {/* Background texture overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.02]"
        style={{
          backgroundImage: 'url(/assets/brand/8050B7B8-4B85-43A4-B053-4FAD252F2029.jpeg)',
        }}
      />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block px-5 py-2.5 bg-white/50 backdrop-blur-md border border-blue-200/40 rounded-full shadow-lg shadow-blue-500/15 mb-8">
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                National <span className="text-blue-600">Growth</span> & Business Infrastructure Firm
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="heading-1 mb-8"
          >
            The one-stop business development solution for new and existing businesses.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="body-large mb-10 max-w-2xl mx-auto"
          >
            From first-time founders to established enterprises, we support businesses at every stage — from the beginning to the elite level.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link href="/contact" className="btn-primary text-lg">
              Start Scaling Today
            </Link>
            <Link href="/services" className="btn-secondary text-lg">
              Our Infrastructure
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="card-premium p-8 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">Multi-State</div>
                <div className="text-sm text-slate-600 font-medium">Operations Served</div>
              </div>
              <div className="text-center border-l border-r border-blue-200/30">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-sm text-slate-600 font-medium">States Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">Scalable</div>
                <div className="text-sm text-slate-600 font-medium">Infrastructure Built</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
