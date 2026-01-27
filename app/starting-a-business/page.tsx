'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

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
    answer: `An LLC (Limited Liability Company) is a legal business structure that protects your personal assets. If your business gets sued or goes into debt, your personal savings, home, and belongings are generally protected. It's like a shield between your business and your personal life.`,
  },
  {
    question: `Why can't I just run my business without forming an entity?`,
    answer: `You can, but it's risky. Without an LLC or other entity, you're personally responsible for all business debts and lawsuits. Plus, many vendors, clients, and banks take you more seriously when you have a formal business entity.`,
  },
  {
    question: 'How long does it take to get everything set up?',
    answer: 'Business formation typically takes 24–48 hours once the intake information is completed accurately. Your EIN is often issued the same day. Website and system development timelines vary based on complexity, but typically take 2–4 weeks, as we work closely with you to ensure everything is built exactly the way you want it.',
  },
  {
    question: 'Do I need a lawyer to start a business?',
    answer: 'Not for basic formation. We handle the paperwork and coordination. If you have complex legal questions or contracts, we can guide you on when to involve an attorney. But for straightforward LLC formation and setup, we handle it directly.',
  },
  {
    question: `What doesn't this include?`,
    answer: `We don't provide legal advice, tax preparation, or accounting services. We also don't handle highly specialized licenses (like medical or legal licenses) — though we coordinate with the right agencies. Our focus is building the infrastructure your business needs to operate.`,
  },
  {
    question: 'How is this different from ZenBusiness or LegalZoom?',
    answer: 'Those services stop after formation. We keep going. Formation, EIN, website, operational systems, and ongoing compliance — all coordinated by one team. No handoffs to other vendors. Everything works together.',
  },
]

const whyStructure = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Asset Protection',
    description: 'Separates business liability from your personal assets',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Tax Benefits',
    description: 'Business deductions and flexible tax treatment',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Credibility',
    description: 'Customers and vendors take you more seriously',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Easier Banking',
    description: 'Open business accounts and access financing',
  },
]

export default function StartingABusinessPage() {
  return (
    <div className="pt-20 md:pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-neutral-50 to-white py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-6"
            >
              <span className="text-sm font-medium text-neutral-600">
                For First-Time Founders
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-1 mb-6"
            >
              Starting a Business, Made Clear
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="body-large"
            >
              {"You don't"} need to figure this out alone. We guide you through forming your business, 
              setting up systems, and staying compliant — step by step, without sending you to 
              multiple vendors.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Why Structure Matters */}
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
              Why Business Structure Matters
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              Forming an LLC or business entity {"isn't"} just paperwork. {"It's"} protection, 
              credibility, and setting up your business to run properly from day one.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {whyStructure.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-neutral-900">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900">
                  {item.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="heading-2 mb-6"
            >
              How It All Works Together
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              Formation, compliance, websites, and systems — coordinated in the right order. 
              We guide you through each step.
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white rounded-xl p-8 md:p-10"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-neutral-900 text-white rounded-xl flex items-center justify-center text-2xl font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-3 text-neutral-900">
                      {step.title}
                    </h3>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {step.details.map((detail) => (
                        <div key={detail} className="flex items-start text-sm text-neutral-600">
                          <span className="mr-2 text-neutral-400 mt-1">✓</span>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Questions */}
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
              Common Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              Clear answers to questions first-time founders often have
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-neutral-50 rounded-xl p-8"
              >
                <h3 className="text-xl font-semibold mb-4 text-neutral-900">
                  {faq.question}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* No Handoffs Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 md:p-12 text-center"
            >
              <h2 className="heading-2 mb-6">No Vendor Handoffs</h2>
              <p className="body-large mb-8">
                Most formation services stop after filing paperwork. Then they tell you to find 
                a web designer. Then an accountant. Then a developer. Each vendor only knows 
                their piece.
              </p>
              <p className="body-large mb-8">
                We handle it all. Formation, EIN, website, systems, compliance. One team that 
                sees the complete picture and coordinates everything.
              </p>
              <p className="text-xl font-semibold text-neutral-900">
                This is what step-by-step guidance actually looks like.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-neutral-900 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="heading-2 mb-6"
            >
              Ready to Start Your Business?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-300 mb-8"
            >
              Schedule a free consultation. {"We'll"} explain exactly what you need and guide 
              you through every step.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-neutral-900 bg-white hover:bg-neutral-100 transition-colors duration-200"
              >
                Schedule Consultation
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-neutral-900 transition-colors duration-200"
              >
                See All Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
