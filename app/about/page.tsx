'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const values = [
  {
    title: 'Systems Built for Scaling',
    description: 'We build business infrastructure with the future in mind. Formation, licensing, websites, and custom AI — coordinated to handle growth without breaking.',
  },
  {
    title: 'No Vendor Roadblocks',
    description: 'Avoid the friction of multiple agencies. We handle the technical, legal, and creative infrastructure in-house so you can scale faster.',
  },
  {
    title: 'Multi-State Stability',
    description: 'National growth comes with compliance complexity. We build systems that remain stable and compliant as you expand across state lines.',
  },
  {
    title: 'Growth & Visibility',
    description: 'Structure without visibility is wasted potential. We integrate social media presence and digital growth strategies into your core operations.',
  },
]

const stats = [
  { number: '1000+', label: 'Systems Built' },
  { number: '50', label: 'States Served' },
  { number: 'Growth', label: 'Engineered' },
  { number: 'All-in-One', label: 'Infrastructure' },
]

export default function AboutPage() {
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
              Engineered for <span className="text-blue-600">Growth</span> & Multi-Location <span className="text-blue-600">Scaling</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              Innovation Business Services is a national business scaling firm. 
              We assemble the legal, technical, and digital infrastructure your business needs to <span className="text-slate-900 font-semibold">grow</span> — as one coordinated system.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-lg text-neutral-700 leading-relaxed"
            >
              <p>
                Most businesses are built in pieces. Formation through a lawyer. Website through 
                a designer. Visibility through a marketing agency. Compliance through an accountant. 
                All separate. All disconnected.
              </p>
              <p>
                When you try to scale, these gaps become roadblocks. Vendor handoffs fail. 
                Multi-state licensing gets missed. Social presence doesn{"'"}t match the operations. 
                And when you hit your next growth milestone, the infrastructure collapses because 
                no one owns the complete picture.
              </p>
              <p>
                We started Innovation Business Services to fix this. We build comprehensive growth 
                infrastructure — from formation and multi-state licensing to scalable AI tools and 
                digital visibility — all coordinated by one team. No handoffs. No gaps. 
                One system engineered for expansion.
              </p>
              <p>
                This isn{"'"}t just about getting started; it{"'"}s about being prepared for what comes next. 
                When your business infrastructure is built as one system, everything works together 
                to support your bottom line. That is what we build.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              How We Operate
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              Our approach to building business infrastructure
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-50 rounded-xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-4 text-neutral-900">
                  {value.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Build Section */}
      <section className="section-padding bg-neutral-50 relative overflow-hidden">
        {/* Background texture overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5 blur-sm"
          style={{
            backgroundImage: 'url(/assets/brand/EF869454-04FC-48B5-A7B4-F5929F708851.jpeg)',
          }}
        />

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="heading-2 mb-6"
            >
              What We Build
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large space-y-4"
            >
              <p>
                Business formation (LLC, nonprofit, multi-state)
              </p>
              <p>
                Websites and custom domains
              </p>
              <p>
                Custom applications tailored to your operations
              </p>
              <p>
                AI tools (chatbots, receptionists, automation)
              </p>
              <p>
                Email and digital communication infrastructure
              </p>
              <p>
                Ongoing compliance and operational support
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="heading-2 mb-6"
            >
              One Team. Complete Infrastructure.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large mb-8"
            >
              Our team includes formation specialists, developers, AI engineers, compliance 
              coordinators, and infrastructure architects. We work as one team to build your 
              complete business system.
            </motion.p>
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
              Let Us Build Your Infrastructure
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-300 mb-8"
            >
              Tell us what {"you're"} building. {"We'll"} handle the structure and systems.
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
