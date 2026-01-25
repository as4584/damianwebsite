'use client'

import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ContactForm() {
  const searchParams = useSearchParams()
  const isSubmitted = searchParams.get('success') === 'true'

  return (
    <div className="bg-neutral-50 rounded-2xl p-8 md:p-10">
      <h2 className="text-2xl font-semibold mb-6 text-neutral-900">
        Schedule Your Consultation
      </h2>

      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Thank You!
          </h3>
          <p className="text-green-700">
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
            value="New Website Inquiry – Innovation Business Services" 
          />
          <input type="text" name="_gotcha" className="hidden" />
          
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-colors"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-colors"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              How can we help? *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-colors"
              placeholder="Tell us about your business goals..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-neutral-900 text-white font-semibold py-4 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Send Message
          </button>
          
          <p className="text-sm text-neutral-600 text-center">
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="heading-3 mb-6">Get in Touch</h2>
      <p className="body-regular mb-8">
        Fill out the form and {"we'll"} get back to you within 24 hours. Or reach out 
        directly using the contact information below.
      </p>

      <div className="space-y-6">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-neutral-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
            <a
              href="mailto:info@innovationbusinessservices.com"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              info@innovationbusinessservices.com
            </a>
          </div>
        </div>

        <div className="flex items-start">
          <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-neutral-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-neutral-900 mb-1">Phone</h3>
            <a
              href="tel:+1234567890"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              (123) 456-7890
            </a>
          </div>
        </div>

        <div className="flex items-start">
          <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-neutral-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-neutral-900 mb-1">Office Hours</h3>
            <p className="text-neutral-600">
              Monday – Friday: 9:00 AM – 5:00 PM
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-neutral-50 rounded-xl">
        <h3 className="font-semibold text-neutral-900 mb-3">
          What to Expect
        </h3>
        <ul className="space-y-2 text-neutral-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>{"We'll"} respond within 24 hours</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Free initial consultation (30 minutes)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Clear pricing with no hidden fees</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Personalized service recommendations</span>
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
      q: 'Do you offer ongoing support after formation?',
      a: 'Yes! We provide ongoing compliance support, annual report filing, and consultation services to help your business stay compliant as you grow.',
    },
    {
      q: 'What states do you serve?',
      a: 'We can help you form your business in all 50 states. We also assist with multi-state registration for businesses expanding to new markets.',
    },
  ]

  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="heading-2 mb-6">Common Questions</h2>
            <p className="body-large">
              Here are answers to some frequently asked questions
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 md:p-8"
              >
                <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                  {faq.q}
                </h3>
                <p className="text-neutral-600 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ContactPage() {
  return (
    <div className="pt-20 md:pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-neutral-50 to-white py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="heading-1 mb-6"
            >
              {"Let's Talk About Your Business"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              Schedule a free consultation to discuss your business goals and learn how we can help
            </motion.p>
          </div>
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Suspense fallback={<div className="bg-neutral-50 rounded-2xl p-8 md:p-10 h-[400px] animate-pulse" />}>
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
