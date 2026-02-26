'use client'

import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { fadeIn, viewportConfig } from '@/lib/motionPresets'
import ComplianceDisclaimer from '@/components/ComplianceDisclaimer'

function ContactForm() {
  const searchParams = useSearchParams()
  const isSubmitted = searchParams.get('success') === 'true'

  return (
    <div className="bg-neutral-50 border border-neutral-200 p-8 md:p-10">
      <h2 className="heading-3 mb-6">Start Your Inquiry</h2>

      {isSubmitted ? (
        <div className="bg-neutral-50 border border-neutral-200 p-6 text-center">
          <h3 className="text-base font-medium text-primary-900 mb-2">
            Thank You
          </h3>
          <p className="text-sm text-neutral-600">
            {"We've"} received your message and will get back to you within 24 hours.
          </p>
        </div>
      ) : (
        <form
          action="https://formspree.io/f/xvzagvzb"
          method="POST"
          className="space-y-6"
        >
          {/* Formspree configuration */}
          <input
            type="hidden"
            name="_redirect"
            value="https://damianwebsite.vercel.app/contact?success=true"
          />
          <input
            type="hidden"
            name="_subject"
            value="New Website Inquiry \u2013 Innovation Business Services"
          />
          <input type="text" name="_gotcha" className="hidden" />

          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium uppercase tracking-[0.1em] text-neutral-500 mb-2"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-white border border-neutral-300 focus:ring-1 focus:ring-primary-900 focus:border-primary-900 transition-colors text-sm"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium uppercase tracking-[0.1em] text-neutral-500 mb-2"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-white border border-neutral-300 focus:ring-1 focus:ring-primary-900 focus:border-primary-900 transition-colors text-sm"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs font-medium uppercase tracking-[0.1em] text-neutral-500 mb-2"
            >
              How can we help? *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="w-full px-4 py-3 bg-white border border-neutral-300 focus:ring-1 focus:ring-primary-900 focus:border-primary-900 transition-colors text-sm"
              placeholder="Tell us about your business goals..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn-primary w-full text-xs"
          >
            Send Message
          </button>

          <p className="text-xs text-neutral-400 text-center">
            By submitting this form, you agree to our Privacy Policy
          </p>
        </form>
      )}
    </div>
  )
}

function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
        Contact
      </p>
      <h2 className="heading-2 mb-6">Get in touch</h2>
      <p className="body-regular mb-10">
        Fill out the form and {"we'll"} get back to you within 24 hours. Or reach out
        directly using the contact information below.
      </p>

      <div className="space-y-6 mb-12">
        <div className="flex items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-400 mb-1">Email</p>
            <a
              href="mailto:info@innovationbusinessservices.com"
              className="text-sm text-primary-900 hover:text-primary-700 transition-colors"
            >
              info@innovationbusinessservices.com
            </a>
          </div>
        </div>

        <div className="flex items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-400 mb-1">Phone</p>
            <a
              href="tel:+1234567890"
              className="text-sm text-primary-900 hover:text-primary-700 transition-colors"
            >
              (123) 456-7890
            </a>
          </div>
        </div>

        <div className="flex items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-400 mb-1">Office Hours</p>
            <p className="text-sm text-neutral-600">Monday – Friday: 9:00 AM – 5:00 PM</p>
          </div>
        </div>
      </div>

      <div className="border border-neutral-200 p-6">
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-400 mb-3">
          What to Expect
        </p>
        <ul className="space-y-2">
          <li className="flex items-center text-sm text-neutral-600">
            <span className="w-1 h-1 bg-primary-900 rounded-full mr-3 flex-shrink-0" />
            {"We'll"} respond within 24 hours
          </li>
          <li className="flex items-center text-sm text-neutral-600">
            <span className="w-1 h-1 bg-primary-900 rounded-full mr-3 flex-shrink-0" />
            Free initial consultation (30 minutes)
          </li>
          <li className="flex items-center text-sm text-neutral-600">
            <span className="w-1 h-1 bg-primary-900 rounded-full mr-3 flex-shrink-0" />
            Clear pricing with no hidden fees
          </li>
          <li className="flex items-center text-sm text-neutral-600">
            <span className="w-1 h-1 bg-primary-900 rounded-full mr-3 flex-shrink-0" />
            Personalized service recommendations
          </li>
        </ul>
      </div>
    </motion.div>
  )
}

function FAQSection() {
  const faqs = [
    {
      q: 'How long does LLC formation take?',
      a: 'Most LLC formations are completed within 7-14 business days, depending on your state. Some states offer expedited processing for an additional fee.',
    },
    {
      q: 'What information do I need to get started?',
      a: "You'll need your desired business name, business address, member information, and your state of formation. We'll guide you through everything else.",
    },
    {
      q: 'What states do you serve?',
      a: 'We can help you form your business in all 50 states. We also assist with multi-state registration for businesses expanding to new markets.',
    },
  ]

  return (
    <section className="section-padding bg-neutral-50 border-t border-neutral-200">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeIn} className="mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
              FAQ
            </p>
            <h2 className="heading-2">Common questions</h2>
          </motion.div>

          <div className="space-y-px bg-neutral-200">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                variants={fadeIn}
                className="bg-white p-6 md:p-8"
              >
                <h3 className="heading-3 mb-2">{faq.q}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <ComplianceDisclaimer />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ContactPage() {
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
              Contact
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-[1.1] mb-6">
              {"Let's"} discuss your business
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl">
              Schedule a free consultation to discuss your growth goals and learn how our
              infrastructure scales with you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <ContactInfo />

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <Suspense fallback={<div className="bg-neutral-50 border border-neutral-200 p-8 md:p-10 h-[400px]" />}>
                <ContactForm />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />
    </div>
  )
}
