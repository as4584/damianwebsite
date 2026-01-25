'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

/**
 * Production-safe progressive card reveal system.
 * Replaces fragile scroll-bound math with a robust IntersectionObserver-based flow.
 * Each step is revealed as it enters the viewport, communicating authority and process.
 */

const cards = [
  {
    step: 'Step 1',
    title: 'We build scalable business systems',
    text: 'From legal formation and licensing to digital growth, we assemble everything your business needs to scale properly — as one coordinated system.',
  },
  {
    step: 'Step 2',
    title: 'We handle the backend & visibility',
    text: 'Formation, multi-state licensing, social media presence, and custom AI tools — all managed by a single expert team.',
  },
  {
    step: 'Step 3',
    title: 'Stability for Multi-State Growth',
    text: 'Operate in more than one place with confidence. No missed steps. No vendor handoffs. Just a clear path to expansion.',
  },
  {
    step: 'Step 4',
    title: 'Engineered for Funding & Scaling',
    text: 'We build the structure that investors and growth require. Refined, repeatable processes that deliver operational excellence.',
  },
  {
    step: 'Step 5',
    title: 'You focus on scaling the business',
    text: 'We handle the infrastructure and compliance so you can focus on growth, visibility, and your bottom line.',
    cta: true,
  },
]

const RevealCard = ({ card, index }: { card: typeof cards[0]; index: number }) => {
  return (
    <motion.div
      // Standard Framer Motion variants for production stability
      initial="hidden"
      whileInView="visible"
      // margin: "-10% 0px -20% 0px" triggers the "active" state when card is prominent
      viewport={{ once: false, margin: '-10% 0px -20% 0px', amount: 0.4 }}
      variants={{
        hidden: { opacity: 0.4, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
      className="w-full max-w-4xl mx-auto mb-16 md:mb-24 last:mb-0 px-4 md:px-0"
    >
      <div className="card-premium p-8 md:p-14 lg:p-16 flex flex-col justify-center shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-blue-100/30">
        <div className="max-w-3xl mx-auto w-full">
          <span className="inline-block px-5 py-2 bg-blue-100/50 backdrop-blur-sm border border-blue-200/40 rounded-full shadow-sm mb-8 text-sm font-semibold text-blue-600 tracking-wide uppercase">
            {card.step}
          </span>
          <h3 className="heading-2 mb-6 text-slate-900 leading-tight">
            {card.title}
          </h3>
          <p className="body-large text-slate-600 leading-relaxed font-normal">
            {card.text}
          </p>
          {card.cta && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center px-10 py-4 text-lg"
              >
                Start Scaling Now
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function StickyScrollCards() {
  return (
    <section className="relative py-24 md:py-40 overflow-hidden bg-gradient-to-b from-transparent via-blue-50/20 to-transparent">
      {/* Ambient decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-2 mb-6 text-slate-900 tracking-tight">
              Scalable Business Infrastructure
            </h2>
            <p className="body-large text-slate-600 max-w-2xl mx-auto">
              One team. One system. Everything your business needs to grow across multiple locations.
            </p>
          </motion.div>
        </div>

        {/* 
          Progressive Reveal Stack
          Cards are in normal document flow.
          No fragile sticky math or absolute positioning.
        */}
        <div className="flex flex-col items-center">
          {cards.map((card, index) => (
            <RevealCard key={index} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
