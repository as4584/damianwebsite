'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const CTASection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white relative overflow-hidden">
      {/* Background texture overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.08] blur-sm"
        style={{
          backgroundImage: 'url(/assets/brand/B11539F4-9B72-4431-9008-75876F774AEF.jpeg)',
        }}
      />
      
      {/* Blue ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="heading-2 mb-6"
          >
            Ready to <span className="text-blue-400">Scale</span> Your Business System?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl text-neutral-300 mb-10 leading-relaxed"
          >
            Tell us about your <span className="text-white font-semibold">growth goals</span>. We handle the formation, infrastructure, 
            and <span className="text-blue-400">multi-state licensing</span> so you can focus on scaling.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-slate-900 bg-white shadow-xl shadow-blue-400/30 hover:shadow-2xl hover:shadow-blue-400/40 hover:scale-[1.02] transition-all duration-300"
            >
              Schedule Consultation
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-300/40 text-lg font-semibold rounded-xl text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-blue-300/60 hover:scale-[1.02] transition-all duration-300"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
