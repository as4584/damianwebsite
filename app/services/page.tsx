'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const services = [
  {
    id: 'formation',
    title: 'Business Formation',
    description: 'Complete LLC and nonprofit entity formation with all required state filings, EIN acquisition, and compliance coordination.',
    longDescription: 'Business formation is the foundation of your infrastructure. We handle entity selection, state registration, EIN acquisition, operating agreements, and initial compliance setup — all coordinated as part of your complete business system.',
    features: [
      'LLC and nonprofit formation',
      'Multi-state registration',
      'Federal EIN acquisition',
      'Operating agreement preparation',
      'Initial compliance coordination',
      'Registered agent service',
    ],
    pricing: 'Custom pricing',
  },
  {
    id: 'websites',
    title: 'Websites & Domains',
    description: 'Professional websites and custom domains managed as part of your business infrastructure.',
    longDescription: 'Your website is not separate from your business — it is your business infrastructure. We build professional sites, secure custom domains, manage DNS, and maintain everything as part of your complete system.',
    features: [
      'Custom website development',
      'Domain registration and management',
      'DNS configuration',
      'SSL certificates',
      'Hosting and maintenance',
      'Content management systems',
    ],
    pricing: 'Custom pricing',
  },
  {
    id: 'applications',
    title: 'Custom Applications',
    description: 'Tailored applications built to support your specific business operations and workflows.',
    longDescription: 'Standard software rarely fits every business. We build custom applications designed for your exact workflows, integrated with your existing systems, and maintained as part of your infrastructure.',
    features: [
      'Custom web applications',
      'Mobile application development',
      'API integrations',
      'Database design and management',
      'User authentication systems',
      'Ongoing updates and support',
    ],
    pricing: 'Custom pricing',
  },
  {
    id: 'ai-tools',
    title: 'AI Tools',
    description: 'AI-powered chatbots, receptionists, and automation tools integrated into your business operations.',
    longDescription: 'AI is not a separate service — it is operational infrastructure. We build and deploy AI chatbots for customer support, AI receptionists for call handling, and automation tools that work within your existing systems.',
    features: [
      'AI chatbot development',
      'AI receptionist systems',
      'Natural language processing',
      'Workflow automation',
      'CRM integrations',
      'Training and optimization',
    ],
    pricing: 'Custom pricing',
  },
  {
    id: 'email',
    title: 'Email & Digital Infrastructure',
    description: 'Professional email systems, digital communication tools, and infrastructure managed as one system.',
    longDescription: 'Email, communication tools, and digital infrastructure should work seamlessly. We set up professional email, configure security, integrate with your domain, and manage everything as part of your business backend.',
    features: [
      'Professional email setup',
      'Custom domain email',
      'Email security and spam filtering',
      'Digital communication tools',
      'Cloud storage integration',
      'Ongoing infrastructure management',
    ],
    pricing: 'Custom pricing',
  },
  {
    id: 'compliance',
    title: 'Ongoing Compliance & Support',
    description: 'Continuous compliance monitoring, annual reports, and ongoing support for all business systems.',
    longDescription: 'Compliance is not a one-time task. We monitor your business obligations, handle annual reports, track renewal deadlines, and provide ongoing support for all aspects of your business infrastructure.',
    features: [
      'Annual report filing',
      'Compliance monitoring',
      'Renewal tracking and reminders',
      'State requirement updates',
      'Document management',
      'Ongoing technical support',
    ],
    pricing: 'Annual plans available',
  },
]

const processSteps = [
  {
    step: 1,
    title: 'Discovery',
    description: "We learn what you're building, what systems you need, and what infrastructure gaps exist.",
  },
  {
    step: 2,
    title: 'System Design',
    description: 'We design your complete business infrastructure — formation, websites, apps, compliance, and tools.',
  },
  {
    step: 3,
    title: 'Build & Deploy',
    description: 'We build and deploy everything as one coordinated system, not separate vendor projects.',
  },
  {
    step: 4,
    title: 'Ongoing Support',
    description: 'We maintain your infrastructure, handle compliance, and support your business as it grows.',
  },
]

export default function ServicesPage() {
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
              Complete Business Infrastructure
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              Formation. Websites. Applications. AI tools. Email. Compliance. 
              Everything your business needs to operate — built and managed as one system.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-50 rounded-2xl p-8 md:p-12 lg:p-16"
              >
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div>
                    <div className="inline-block px-4 py-1 bg-white rounded-full mb-4">
                      <span className="text-sm font-medium text-neutral-600">
                        {service.pricing}
                      </span>
                    </div>
                    <h2 className="heading-3 mb-4">{service.title}</h2>
                    <p className="body-regular mb-6">{service.longDescription}</p>
                    <Link href="/contact" className="btn-primary">
                      Discuss Your Needs
                    </Link>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-neutral-900">
                      {"What's"} Included
                    </h3>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-neutral-900 mr-3 mt-0.5 flex-shrink-0"
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
                          <span className="text-neutral-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              How We Build Your System
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              A coordinated approach to building complete business infrastructure
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-neutral-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                  {step.title}
                </h3>
                <p className="text-neutral-600">{step.description}</p>
              </motion.div>
            ))}
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
              Let Us Build Your Business System
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-300 mb-8"
            >
              Tell us what {"you're"} building. {"We'll"} design and deploy the infrastructure you need.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-neutral-900 bg-white hover:bg-neutral-100 transition-colors duration-200"
              >
                Schedule a Consultation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
