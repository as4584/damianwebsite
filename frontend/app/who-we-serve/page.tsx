'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { fadeIn, staggerContainer, viewportConfig } from '@/lib/motionPresets'
import ComplianceDisclaimer from '@/components/ComplianceDisclaimer'

const industryCategories = [
  {
    category: 'Tech & Digital Startups',
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
    businesses: [
      'Private-label brands', 'Dropshipping stores', 'Amazon FBA brands',
      'Subscription box services', 'Print-on-demand apparel', 'Custom merch brands',
      'Eco-friendly product brands', 'Fitness product brands', 'Beauty & skincare lines',
      'Supplements (compliant)', 'Pet products', 'Smart kitchen gadgets',
      'Home organization products', "Children's toys", 'Educational kits',
      'Office productivity tools', 'Personalized gifts', 'Packaging design services'
    ]
  },
  {
    category: 'Professional & Business Services',
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
    businesses: [
      'Online course businesses', 'Coaching programs', 'Tutoring services',
      'Test prep companies', 'Trade skill academies', 'Certification programs',
      'Corporate learning platforms', 'Mastermind groups', 'Membership communities',
      'E-books & digital guides', 'Licensing education content'
    ]
  },
  {
    category: 'Sustainability & Future-Focused',
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
    structures: [
      'Sole Proprietorship',
      'Sole Proprietorship with DBA (Doing Business As / Fictitious Name)',
      'Independent Contractor (tax status, not a separate entity)',
      'Professional Sole Proprietorship (licensed professionals in some states)'
    ]
  },
  {
    category: 'Partnerships (General & Limited)',
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
    structures: [
      'Benefit Corporation (B-Corp legal structure)',
      'Public Benefit Corporation (PBC) (Delaware & others)',
      'Social Purpose Corporation (state-specific)'
    ]
  },
  {
    category: 'Nonprofit & Tax-Exempt Entities',
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
    structures: [
      'Joint Venture (can be contractual or entity-based)',
      'Strategic Alliance (contractual)',
      'Consortium',
      'Syndicate'
    ]
  },
  {
    category: 'Foreign & Cross-Border Structures',
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
    structures: [
      'Municipal Corporation',
      'Public Authority',
      'Government-Owned Corporation',
      'Quasi-Public Corporation'
    ]
  },
  {
    category: 'Rare / Edge-Case Structures',
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
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="bg-primary-900 py-20 md:py-28">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400 mb-6">
                  Our Clients
                </p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-[1.1]">
                  Who we serve
                </h1>
              </div>
              <p className="text-lg text-neutral-300 leading-relaxed">
                We serve people who want to turn their ideas into reality — and those who have already built something meaningful.
                From first-time entrepreneurs to experienced business owners, inherited businesses, partnerships, and professional services.
              </p>
            </div>

            {/* Executive Summary Stats */}
            <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-3 gap-8">
              <div>
                <span className="font-serif text-3xl md:text-4xl text-white">200+</span>
                <p className="text-sm text-neutral-400 mt-1">Business Types Supported</p>
              </div>
              <div>
                <span className="font-serif text-3xl md:text-4xl text-white">78</span>
                <p className="text-sm text-neutral-400 mt-1">Entity Structures</p>
              </div>
              <div>
                <span className="font-serif text-3xl md:text-4xl text-white">50</span>
                <p className="text-sm text-neutral-400 mt-1">States Covered</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="border-b border-neutral-200 bg-white sticky top-16 md:top-20 z-30">
        <div className="container-custom">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab('industries')}
              className={`px-6 py-4 text-sm font-medium uppercase tracking-[0.1em] border-b-2 transition-colors duration-200 ${
                activeTab === 'industries'
                  ? 'border-primary-900 text-primary-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Industries & Business Types
            </button>
            <button
              onClick={() => setActiveTab('entities')}
              className={`px-6 py-4 text-sm font-medium uppercase tracking-[0.1em] border-b-2 transition-colors duration-200 ${
                activeTab === 'entities'
                  ? 'border-primary-900 text-primary-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Entity Structures
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">

          {/* Industries Content */}
          {activeTab === 'industries' && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-px bg-neutral-200"
            >
              {industryCategories.map((category) => (
                <motion.div
                  key={category.category}
                  variants={fadeIn}
                  className="bg-white p-8 md:p-10"
                >
                  <h2 className="heading-3 mb-6">{category.category}</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-2">
                    {category.businesses.map((business) => (
                      <p key={business} className="text-sm text-neutral-600 py-1 flex items-center">
                        <span className="w-1 h-1 bg-primary-900 rounded-full mr-3 flex-shrink-0" />
                        {business}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Entity Structures Content */}
          {activeTab === 'entities' && (
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-neutral-50 border border-neutral-200 p-6 mb-8"
              >
                <p className="text-sm text-neutral-600 leading-relaxed">
                  <span className="font-medium text-primary-900">Note:</span> S-Corp and LLC taxed as S-Corp are tax elections, not new entities.
                  Many structures overlap legally but differ by state statute, tax treatment, or licensing rules.
                  Some entities (like L3C, Series LLC, Close Corporations) are state-restricted but federally recognized.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-px bg-neutral-200"
              >
                {entityStructures.map((category) => (
                  <motion.div
                    key={category.category}
                    variants={fadeIn}
                    className="bg-white p-8 md:p-10"
                  >
                    <h2 className="heading-3 mb-6">{category.category}</h2>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                      {category.structures.map((structure, idx) => (
                        <p key={structure} className="text-sm text-neutral-600 py-1 flex items-start">
                          <span className="text-xs text-neutral-400 font-medium min-w-[2rem] mt-px">{String(idx + 1).padStart(2, '0')}</span>
                          {structure}
                        </p>
                      ))}
                    </div>
                    {(category as any).disclaimer && (
                      <p className="mt-6 text-xs text-neutral-400 border-t border-neutral-100 pt-4">
                        {(category as any).disclaimer}
                      </p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-primary-900 text-white">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeIn}
            className="max-w-2xl"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-6">
              Tell us about your business
            </h2>
            <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8">
              {"We'll"} understand your industry requirements and build infrastructure that fits
              your regulatory and operational needs.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 text-sm font-medium tracking-wide uppercase text-primary-900 bg-white border border-white hover:bg-neutral-100 transition-colors duration-200"
            >
              Schedule a Consultation
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
