'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { heroImages } from '@/lib/heroImages'

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-20 md:pt-24 bg-primary-900 overflow-hidden">
      <Image
        src={heroImages[0].src}
        alt={heroImages[0].alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Subtle dark texture overlay */}
      <div className="absolute inset-0 bg-primary-950/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/45 via-primary-950/20 to-primary-900/70" />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400 mb-6">
              National Business Infrastructure Firm
            </p>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-normal text-white leading-[1.1] mb-8">
              The one-stop business development solution for new and existing businesses.
            </h1>

            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed mb-10 max-w-2xl">
              From first-time founders to established enterprises, we support businesses at every stage — from the beginning to the elite level.
            </p>

            <Link href="/contact" className="inline-flex items-center justify-center px-10 py-4 text-sm font-medium tracking-wide uppercase text-primary-900 bg-white border border-white hover:bg-neutral-100 transition-colors duration-200">
              Schedule a Consultation
            </Link>
          </motion.div>

          {/* Institutional stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            className="mt-20 pt-8 border-t border-white/15"
          >
            <div className="grid grid-cols-3 gap-8 md:gap-16">
              <div>
                <div className="text-2xl md:text-3xl font-serif text-white mb-1">50</div>
                <div className="text-xs text-neutral-400 uppercase tracking-[0.15em]">States Served</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif text-white mb-1">Multi-State</div>
                <div className="text-xs text-neutral-400 uppercase tracking-[0.15em]">Coordination</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif text-white mb-1">Enterprise</div>
                <div className="text-xs text-neutral-400 uppercase tracking-[0.15em]">Infrastructure</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
