'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

const industryCategories = [
  {
    category: 'Tech & Digital Startups',
    icon: '💻',
    businesses: [
      'SaaS (niche software tools)', 'AI automation agencies', 'No-code app development',
      'Cybersecurity consulting', 'Data analytics services', 'CRM customization services',
      'Workflow automation (Zapier-style)', 'Cloud migration consulting', 'API integration services',
      'Web3 infrastructure tools', 'Blockchain auditing', 'Smart contract development',
      'IoT device startups', 'Health tech platforms', 'Telemedicine solutions',
      'EdTech platforms', 'HR tech tools', 'FinTech micro-lending',
      'Digital identity verification', 'Subscription management software'
    ]
  },
  {
    category: 'Marketing, Media & Creative',
    icon: '🧠',
    businesses: [
      'Digital marketing agency', 'Social media management', 'Influencer marketing agency',
      'Content creation studios', 'Podcast production', 'Video editing services',
      'Copywriting agency', 'SEO consulting', 'Email marketing services',
      'Brand strategy consulting', 'PR & reputation management', 'Community management',
      'UGC creation agencies', 'Newsletter businesses', 'Meme marketing pages',
      'Paid ads management', 'Funnel-building services', 'CRO (conversion rate optimization)'
    ]
  },
  {
    category: 'Construction, Trades & Local Services',
    icon: '🏗️',
    businesses: [
      'General contracting', 'Home remodeling', 'Roofing services',
      'Plumbing services', 'Electrical contracting', 'HVAC services',
      'Smart home installation', 'Solar panel installation', 'Property maintenance',
      'Power washing services', 'Landscaping & lawn care', 'Snow removal',
      'Junk removal', 'Mold remediation', 'Pest control',
      'Fire protection services', 'Security system installation', 'Commercial cleaning',
      'Post-construction cleanup'
    ]
  },
  {
    category: 'Real Estate & Property',
    icon: '🏠',
    businesses: [
      'Property management', 'Airbnb management', 'Real estate wholesaling',
      'Fix & flip operations', 'Home staging services', 'Inspection services',
      'Appraisal services', 'Real estate photography', 'Short-term rental consulting',
      'Tenant screening services', 'Eviction processing services', 'HOA management',
      'Commercial leasing brokerage', 'Land development', 'Real estate lead gen agencies'
    ]
  },
  {
    category: 'E-Commerce & Physical Products',
    icon: '🛍️',
    businesses: [
      'Private-label brands', 'Dropshipping stores', 'Amazon FBA brands',
      'Subscription box services', 'Print-on-demand apparel', 'Custom merch brands',
      'Eco-friendly product brands', 'Fitness product brands', 'Beauty & skincare lines',
      'Supplements (compliant)', 'Pet products', 'Smart kitchen gadgets',
      'Home organization products', `Children's toys`, 'Educational kits',
      'Office productivity tools', 'Personalized gifts', 'Packaging design services'
    ]
  },
  {
    category: 'Professional & Business Services',
    icon: '🧾',
    businesses: [
      'Bookkeeping services', 'Accounting firms', 'Tax prep services',
      'Payroll services', 'Virtual CFO services', 'Legal document preparation',
      'Business formation services', 'Compliance consulting', 'Grant writing services',
      'Loan brokerage', 'Insurance brokerage', 'Risk management consulting',
      'Business valuation services', 'Exit planning consulting', 'Corporate training programs'
    ]
  },
  {
    category: 'Health, Wellness & Fitness',
    icon: '💪',
    businesses: [
      'Personal training studios', 'Mobile fitness trainers', 'Boutique gyms',
      'Physical therapy clinics', 'Chiropractic clinics', 'Massage therapy',
      'Cryotherapy studios', 'IV hydration clinics', 'Weight loss clinics',
      'Nutrition coaching', 'Wellness retreats', 'Mental health coaching',
      'Corporate wellness programs', 'Recovery centers', 'Biohacking services'
    ]
  },
  {
    category: 'Food, Beverage & Hospitality',
    icon: '🍔',
    businesses: [
      'Food trucks', 'Ghost kitchens', 'Meal prep services',
      'Specialty coffee brands', 'Juice bars', 'Smoothie shops',
      'Craft beverage brands', 'Catering services', 'Pop-up restaurants',
      'Specialty bakeries', 'Vegan food brands', 'Ethnic cuisine restaurants',
      'Functional beverages', 'Cloud-based restaurant software'
    ]
  },
  {
    category: 'Lifestyle, Personal & Niche Services',
    icon: '🐶',
    businesses: [
      'Pet grooming services', 'Dog walking businesses', 'Pet boarding',
      'Mobile vet services', 'Senior care services', 'Home health aides',
      'Concierge services', 'Personal assistants', 'Professional organizers',
      'Life coaching', 'Dating consulting', 'Matchmaking services',
      'Event planning', 'Wedding services', 'Mobile car detailing', 'Auto wrap services'
    ]
  },
  {
    category: 'Education, Coaching & Info Products',
    icon: '🎓',
    businesses: [
      'Online course businesses', 'Coaching programs', 'Tutoring services',
      'Test prep companies', 'Trade skill academies', 'Certification programs',
      'Corporate learning platforms', 'Mastermind groups', 'Membership communities',
      'E-books & digital guides', 'Licensing education content'
    ]
  },
  {
    category: 'Sustainability & Future-Focused',
    icon: '🌱',
    businesses: [
      'Renewable energy startups', 'EV charging installation', 'Battery recycling',
      'Carbon offset platforms', 'Sustainable packaging', 'Green construction',
      'Water purification solutions', 'Waste management tech', 'Urban farming',
      'Vertical farming', 'AgTech platforms', 'Food waste reduction apps'
    ]
  }
]

const entityStructures = [
  {
    category: 'Individual / Unincorporated Structures',
    icon: '👤',
    structures: [
      'Sole Proprietorship',
      'Sole Proprietorship with DBA (Doing Business As / Fictitious Name)',
      'Independent Contractor (tax status, not a separate entity)',
      'Professional Sole Proprietorship (licensed professionals in some states)'
    ]
  },
  {
    category: 'Partnerships (General & Limited)',
    icon: '🤝',
    structures: [
      'General Partnership (GP)',
      'Limited Partnership (LP)',
      'Limited Liability Partnership (LLP)',
      'Limited Liability Limited Partnership (LLLP) (state-specific)',
      'Professional Partnership (PP)',
      'Registered Partnership (terminology varies by state)'
    ]
  },
  {
    category: 'Limited Liability Companies (LLCs)',
    icon: '🏢',
    structures: [
      'Standard LLC',
      'Single-Member LLC',
      'Multi-Member LLC',
      'Series LLC (state-specific)',
      'Professional LLC (PLLC / P.C.C.)',
      'L3C (low-profit, mission-driven, state-specific)',
      'Manager-Managed LLC',
      'Member-Managed LLC'
    ],
    disclaimer: 'Entity availability and requirements vary by state. We guide you through the correct structure based on your business, industry, and location.'
  },
  {
    category: 'Corporations (For-Profit)',
    icon: '🏛️',
    structures: [
      'C Corporation',
      'S Corporation (IRS tax election, not entity type)',
      'Professional Corporation (PC / P.C.)',
      'Professional Service Corporation (PSC)',
      'Close Corporation',
      'Statutory Close Corporation',
      'Non-Stock Corporation (can be for-profit in some states)'
    ]
  },
  {
    category: 'Social / Mission-Driven Entities',
    icon: '🌱',
    structures: [
      'Benefit Corporation (B-Corp legal structure)',
      'Public Benefit Corporation (PBC) (Delaware & others)',
      'Social Purpose Corporation (state-specific)'
    ]
  },
  {
    category: 'Nonprofit & Tax-Exempt Entities',
    icon: '🏦',
    structures: [
      'Nonprofit Corporation',
      'Public Charity (501(c)(3))',
      'Private Foundation',
      'Religious Corporation',
      'Charitable Trust',
      'Nonprofit Association',
      '501(c)(4) – Social Welfare Org',
      '501(c)(5) – Labor/Agricultural Org',
      '501(c)(6) – Business League / Chamber',
      '501(c)(7) – Social Club',
      '501(c)(8) – Fraternal Society',
      '501(c)(10) – Domestic Fraternal Org',
      '501(c)(19) – Veterans Org'
    ]
  },
  {
    category: 'Trust-Based & Estate-Style Entities',
    icon: '🧾',
    structures: [
      'Business Trust',
      'Statutory Trust',
      'Massachusetts Trust',
      'Grantor Trust (business use)',
      'Irrevocable Business Trust',
      'Real Estate Investment Trust (REIT)'
    ]
  },
  {
    category: 'Joint & Contractual Structures',
    icon: '🏗️',
    structures: [
      'Joint Venture (can be contractual or entity-based)',
      'Strategic Alliance (contractual)',
      'Consortium',
      'Syndicate'
    ]
  },
  {
    category: 'Foreign & Cross-Border Structures',
    icon: '🌍',
    structures: [
      'Foreign LLC (out-of-state registration)',
      'Foreign Corporation',
      'U.S. Subsidiary of Foreign Company',
      'Branch Office of Foreign Entity',
      'Representative Office'
    ]
  },
  {
    category: 'Cooperatives & Member-Owned Entities',
    icon: '🧠',
    structures: [
      'Cooperative (Co-op)',
      'Worker Cooperative',
      'Consumer Cooperative',
      'Producer Cooperative',
      'Housing Cooperative',
      'Credit Union',
      'Mutual Insurance Company'
    ]
  },
  {
    category: 'Holding & Complex Structures',
    icon: '🏢',
    structures: [
      'Holding Company (LLC or Corp)',
      'Operating Company (OpCo)',
      'Management Company',
      'Captive Insurance Company',
      'Special Purpose Vehicle (SPV / SPE)',
      'Series within a Series LLC'
    ]
  },
  {
    category: 'Government-Related & Quasi-Public',
    icon: '🏛️',
    structures: [
      'Municipal Corporation',
      'Public Authority',
      'Government-Owned Corporation',
      'Quasi-Public Corporation'
    ]
  },
  {
    category: 'Rare / Edge-Case Structures',
    icon: '🧪',
    structures: [
      'Unincorporated Association',
      'Mutual Benefit Corporation',
      'Religious Association',
      'Ecclesiastical Corporation',
      'Statutory Entity (custom state-created forms)'
    ]
  }
]

export default function WhoWeServePage() {
  const [activeTab, setActiveTab] = useState<'industries' | 'entities'>('industries')

  return (
    <div className="pt-20 md:pt-24">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-blue-50/30 to-purple-50/20" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="heading-1 mb-6 text-blue-600"
            >
              Who We Serve
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="body-large"
            >
              We serve people who want to turn their ideas into reality — and those who have already built something meaningful.
              From first-time entrepreneurs to experienced business owners, inherited businesses, partnerships, and professional services, we support organizations that are growing, expanding, or protecting what they’ve worked hard to build.
              We also work with mission-driven entities, including nonprofits and organizations created to support a cause.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="section-padding bg-white/40 backdrop-blur-sm">
        <div className="container-custom">
          <div className="flex justify-center mb-16">
            <div className="card-premium p-2 inline-flex gap-2">
              <button
                onClick={() => setActiveTab('industries')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'industries'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Industries & Business Types
              </button>
              <button
                onClick={() => setActiveTab('entities')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'entities'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Entity Structures
              </button>
            </div>
          </div>

          {/* Industries Content */}
          {activeTab === 'industries' && (
            <div className="space-y-12">
              {industryCategories.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="card-premium p-8 md:p-10"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl">{category.icon}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                      {category.category}
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.businesses.map((business) => (
                      <div key={business} className="flex items-start gap-2 text-slate-600">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{business}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Entity Structures Content */}
          {activeTab === 'entities' && (
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card-premium p-6 bg-blue-50/50"
              >
                <p className="text-slate-700 leading-relaxed">
                  <strong>Note:</strong> S-Corp and LLC taxed as S-Corp are tax elections, not new entities. 
                  Many structures overlap legally but differ by state statute, tax treatment, or licensing rules. 
                  Some entities (like L3C, Series LLC, Close Corporations) are state-restricted but federally recognized.
                </p>
              </motion.div>

              {entityStructures.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="card-premium p-8 md:p-10"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl">{category.icon}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                      {category.category}
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {category.structures.map((structure, idx) => (
                      <div key={structure} className="flex items-start gap-2 text-slate-600">
                        <span className="text-blue-500 font-semibold min-w-[2rem]">{idx + 1}.</span>
                        <span>{structure}</span>
                      </div>
                    ))}
                  </div>
                  {(category as any).disclaimer && (
                    <p className="mt-6 text-sm text-slate-500 italic border-t border-slate-100 pt-4">
                      {(category as any).disclaimer}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* National Coverage */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent" />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="heading-2 mb-6">National Coverage</h2>
              <p className="body-large">
                We serve businesses across all 50 states. Multi-state operations, 
                distributed teams, and varying state requirements — all coordinated.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card-premium p-8 md:p-12"
            >
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                    50
                  </div>
                  <div className="text-slate-600">States Covered</div>
                </div>
                <div className="border-l border-r border-blue-200/30">
                  <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                    200+
                  </div>
                  <div className="text-slate-600">Business Types Supported</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                    78
                  </div>
                  <div className="text-slate-600">Entity Structures</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="heading-2 mb-6"
            >
              Tell Us About Your Business
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-neutral-300 mb-8"
            >
              {`We'll understand your industry requirements and build infrastructure that fits 
              your regulatory and operational needs.`}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-slate-900 bg-white shadow-xl shadow-blue-400/30 hover:shadow-2xl hover:shadow-blue-400/40 hover:scale-[1.02] transition-all duration-300"
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
