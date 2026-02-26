'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { fadeIn, sectionReveal, staggerContainer, viewportConfig } from '@/lib/motionPresets'
import ComplianceDisclaimer from '@/components/ComplianceDisclaimer'
import { heroImages } from '@/lib/heroImages'

const steps = [
  {
    number: '01',
    title: 'Choose Your Business Structure',
    description: 'An LLC (Limited Liability Company) is the most common structure for new businesses. It protects your personal assets while keeping things simple. We help you understand which structure fits your situation.',
    details: [
      'Protects personal assets from business debts',
      'Simpler taxes than corporations',
      'Flexibility in how you run the business',
      'Professional credibility with customers',
    ],
  },
  {
    number: '02',
    title: 'Form Your Business Entity',
    description: 'We handle the paperwork to officially create your LLC or business entity with the state. This makes your business a real, legal entity separate from you personally.',
    details: [
      'Articles of organization filed with the state',
      'Operating agreement for internal rules',
      'Multi-state registration if you need it',
      'Name reservation and verification',
    ],
  },
  {
    number: '03',
    title: 'Get Your EIN and Tax Setup',
    description: 'An EIN (Employer Identification Number) is like a Social Security number for your business. You need it to open a bank account, hire employees, and file taxes. We coordinate this with the IRS.',
    details: [
      'Federal tax identification number (EIN)',
      'Business bank account setup guidance',
      'Tax structure planning',
      'Payroll setup if hiring employees',
    ],
  },
  {
    number: '04',
    title: 'Build Your Digital Presence',
    description: 'Your website is often the first thing customers see. We build professional websites with custom domains, email addresses, and systems that work together with your business structure.',
    details: [
      'Professional website design',
      'Custom domain registration',
      'Business email setup',
      'Online payment integration if needed',
    ],
  },
  {
    number: '05',
    title: 'Set Up Operational Systems',
    description: 'Depending on your business, you may need scheduling systems, customer management tools, or automated processes. We build applications and tools tailored to how you work.',
    details: [
      'Customer management systems',
      'Appointment scheduling tools',
      'AI chatbots and automation',
      'Payment and invoice systems',
    ],
  },
  {
    number: '06',
    title: 'Stay Compliant',
    description: 'Businesses have ongoing requirements — annual reports, renewals, licenses, permits. We track deadlines and coordinate renewals so nothing slips through the cracks.',
    details: [
      'Annual report filings',
      'Business license renewals',
      'State compliance tracking',
      'Ongoing regulatory guidance',
    ],
  },
]

const faqs = [
  {
    question: 'What exactly is an LLC?',
    answer: "An LLC (Limited Liability Company) is a legal business structure that protects your personal assets. If your business gets sued or goes into debt, your personal savings, home, and belongings are generally protected. It's like a shield between your business and your personal life.",
  },
  {
    question: "Why can't I just run my business without forming an entity?",
    answer: "You can, but it's risky. Without an LLC or other entity, you're personally responsible for all business debts and lawsuits. Plus, many vendors, clients, and banks take you more seriously when you have a formal business entity.",
  },
  {
    question: 'How long does it take to get everything set up?',
    answer: 'Business formation typically takes 24–48 hours once the intake information is completed accurately. Your EIN is often issued the same day. Website and system development timelines vary based on complexity, but typically take 2–4 weeks, as we work closely with you to ensure everything is built exactly the way you want it.',
  },
  {
    question: "What doesn't this include?",
    answer: "We don't provide legal advice, tax preparation, or accounting services. We also don't handle highly specialized licenses (like medical or legal licenses) — though we coordinate with the right agencies. Our focus is building the infrastructure your business needs to operate.",
  },
]

const whyStructure = [
  {
    title: 'Asset Protection',
    description: 'Separates business liability from your personal assets',
  },
  {
    title: 'Tax Benefits',
    description: 'Business deductions and flexible tax treatment',
  },
  {
    title: 'Credibility',
    description: 'Customers and vendors take you more seriously',
  },
  {
    title: 'Easier Banking',
    description: 'Open business accounts and access financing',
  },
]

export default function StartingABusinessPage() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="relative bg-primary-900 py-20 md:py-28 overflow-hidden">
        <Image
          src={heroImages[4].src}
          alt={heroImages[4].alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary-950/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/45 via-primary-950/20 to-primary-900/70" />

        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionReveal}
            className="max-w-3xl"
          >
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400 mb-6">
              For First-Time Founders
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-[1.1] mb-6">
              Starting a business, made clear
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl">
              {"You don't"} need to figure this out alone. We guide you through forming your business,
              setting up systems, and staying compliant — step by step, without sending you to
              multiple vendors.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeIn} className="mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
              Foundation
            </p>
            <h2 className="heading-2 max-w-xl">Why business structure matters</h2>
            <p className="body-regular mt-4 max-w-2xl">
              Forming an LLC or business entity {"isn't"} just paperwork. {"It's"} protection,
              credibility, and setting up your business to run properly from day one.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200"
          >
            {whyStructure.map((item) => (
              <motion.div key={item.title} variants={fadeIn} className="bg-white p-8">
                <h3 className="heading-3 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-neutral-50 border-y border-neutral-200">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeIn} className="mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
              Process
            </p>
            <h2 className="heading-2 max-w-xl">How it all works together</h2>
            <p className="body-regular mt-4 max-w-2xl">
              Formation, compliance, websites, and systems — coordinated in the right order.
              We guide you through each step.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="space-y-px bg-neutral-200 max-w-4xl"
          >
            {steps.map((step) => (
              <motion.div key={step.number} variants={fadeIn} className="bg-white p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <span className="text-xs font-medium text-neutral-400 tracking-[0.15em]">{step.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="heading-3 mb-3">{step.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-6">{step.description}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {step.details.map((detail) => (
                        <p key={detail} className="text-sm text-neutral-600 flex items-center">
                          <span className="w-1 h-1 bg-primary-900 rounded-full mr-3 flex-shrink-0" />
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeIn} className="mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
              FAQ
            </p>
            <h2 className="heading-2 max-w-xl">Common questions</h2>
            <p className="body-regular mt-4 max-w-2xl">
              Clear answers to questions first-time founders often have
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="space-y-px bg-neutral-200 max-w-4xl"
          >
            {faqs.map((faq) => (
              <motion.div key={faq.question} variants={fadeIn} className="bg-white p-8">
                <h3 className="heading-3 mb-3">{faq.question}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-primary-900 text-white">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeIn} className="max-w-2xl">
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-6">
              Ready to start your business?
            </h2>
            <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8">
              Schedule a free consultation. {"We'll"} explain exactly what you need and guide
              you through every step.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-medium tracking-wide uppercase text-primary-900 bg-white border border-white hover:bg-neutral-100 transition-colors duration-200"
            >
              Schedule Consultation
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
