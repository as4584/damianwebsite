/**
 * KB-A: Public Knowledge Base
 * This is the ONLY knowledge the chatbot may directly quote or explain.
 * All content here should be safe to display verbatim on the public website.
 */

export const publicKB = {
  services: {
    overview: "We provide comprehensive business development solutions including entity formation, licensing coordination, digital infrastructure, and ongoing compliance support.",
    formation: "We handle LLC and nonprofit formation, multi-state registration, EIN acquisition, operating agreements, and registered agent services.",
    licensing: "We coordinate business licensing requirements and multi-state compliance, working with the appropriate agencies on your behalf.",
    digital: "We build professional websites, custom applications, and AI-powered tools as part of your business infrastructure.",
    compliance: "We monitor ongoing compliance obligations, handle annual reports, and track renewal deadlines across all states where you operate.",
    notIncluded: "We don't provide legal advice, tax preparation, or accounting services. We don't handle highly specialized professional licenses (medical, legal) directly, though we coordinate with the right agencies."
  },
  
  entities: {
    llc: {
      name: "Limited Liability Company (LLC)",
      description: "An LLC protects your personal assets by separating business liability from personal liability. It offers flexible tax treatment and is suitable for most small to medium businesses.",
      benefits: ["Personal asset protection", "Flexible tax options", "Simpler than corporations", "Credibility with clients and vendors"]
    },
    corporation: {
      name: "Corporation",
      description: "A corporation is a separate legal entity that can issue stock. It provides strong liability protection and is often used for businesses seeking investors or planning significant growth.",
      benefits: ["Strong liability protection", "Can issue stock", "Perpetual existence", "Attractive to investors"]
    },
    nonprofit: {
      name: "Nonprofit Corporation",
      description: "A nonprofit is organized for charitable, educational, religious, or other mission-driven purposes. It can apply for tax-exempt status under 501(c)(3) and similar designations.",
      benefits: ["Tax-exempt status potential", "Grant eligibility", "Mission-driven structure", "Donor deductibility"]
    }
  },
  
  consultation: {
    purpose: "A consultation allows us to review your specific situation, including your industry, location, ownership structure, and goals. We'll recommend the right entity type and structure based on your unique needs.",
    what: "During a consultation, we'll discuss your business model, review licensing requirements, assess multi-state considerations, and create a customized plan for your formation and infrastructure needs.",
    whenNeeded: [
      "You're unsure which entity type fits your situation",
      "You operate or plan to operate in multiple states",
      "You have licensing requirements specific to your industry",
      "You need guidance on tax structure decisions",
      "You have partners or complex ownership",
      "You're inheriting or acquiring a business"
    ],
    duration: "Initial consultations are typically 30 minutes and are complimentary.",
    outcome: "You'll receive clear recommendations, pricing, and a timeline for getting your business properly structured."
  },
  
  process: {
    timeline: "Business formation typically takes 24-48 hours once intake information is complete. EIN issuance is often same-day. Website and system development varies by complexity but typically takes 2-4 weeks.",
    states: "We serve businesses in all 50 states and coordinate multi-state registrations.",
    support: "We provide ongoing support after formation, including compliance monitoring, annual reports, and consultation services."
  },
  
  disclaimers: {
    noAdvice: "We do not provide legal advice, tax advice, or accounting services. We build business infrastructure and coordinate filings.",
    consultation: "Entity selection and structure recommendations require a consultation to review your specific circumstances.",
    stateSpecific: "Entity availability and requirements vary by state. We guide you through the correct structure based on your business, industry, and location."
  }
} as const;

export type PublicKB = typeof publicKB;
