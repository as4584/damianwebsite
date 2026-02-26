/**
 * Response Templates & CTA Copy
 * All user-facing messages used by the chatbot
 */

export const messages = {
  // Welcome messages
  welcome: {
    initial: "I'll ask a few questions to get you set up and schedule your consultation. What brings you here today?",
    returning: "Welcome back! What brings you here today?"
  },
  
  // Intent-based responses
  intents: {
    entityHelp: "I'll ask a few questions to understand your needs.",
    notSure: "No problem! Let's start with the basics.",
    pricing: "Pricing depends on your specific needs. I'll ask a few questions first.",
    consultation: "I'll collect a few details and get you scheduled.",
    generalInfo: "I'd be happy to explain how we work. What would you like to know?"
  },
  
  // Progressive questions
  questions: {
    businessType: "What type of business are you setting up? (For example: consulting, e-commerce, restaurant, etc.)",
    alreadyOperating: "Are you already operating, or is this a new business you're planning?",
    hasPartners: "Will you have partners or co-owners?",
    location: "Where will your business be based? (State or city)",
    multiState: "Do you plan to operate in multiple states?",
    licensing: "Does your business require any special licenses or permits?",
    missionDriven: "Is this a for-profit business or a nonprofit/mission-driven organization?"
  },
  
  // Acknowledgments
  ack: {
    understood: "Got it.",
    helpful: "That's helpful to know.",
    important: "That's an important detail.",
    noted: "Noted."
  },
  
  // Escalation messages
  escalation: {
    requiresReview: "This requires a detailed review during a consultation.",
    complexity: "Based on what you've shared, a consultation will ensure we address all the important details.",
    stateSpecific: "State-specific requirements vary, so we'll need to review this during a consultation.",
    licensingRequired: "Licensing requirements are specific to your industry and location. We'll review this in detail during your consultation.",
    partnershipNeeded: "Partnership structures benefit from detailed planning. Let's schedule a consultation to design the right setup.",
    multiStateNeeded: "Multi-state operations require coordinated planning. A consultation will help us map out your expansion strategy."
  },
  
  // Summary before escalation
  summary: {
    intro: "Here's what I've gathered so far:",
    businessType: "Business type: {type}",
    location: "Location: {location}",
    partners: "Ownership: {ownership}",
    licensing: "Licensing: {licensing}",
    outro: "A consultation will allow us to review these details and recommend the right structure and approach for your situation."
  },
  
  // Lead capture
  leadCapture: {
    intro: "Great! To schedule your consultation, I'll need a few details.",
    name: "What's your name?",
    email: "And what's the best email to reach you?",
    phone: "Would you like to provide a phone number? (Optional)",
    confirm: "Perfect! We'll reach out to {name} at {email} within 24 hours to schedule your consultation."
  },
  
  // CTA variants
  ctas: {
    scheduleConsultation: "Schedule your consultation",
    learnMore: "Tell me more",
    startOver: "Start over",
    getStarted: "Get started"
  },
  
  // Informational responses (from KB-A)
  info: {
    whatWeDo: "We provide comprehensive business development solutions including entity formation, licensing coordination, websites, custom applications, and ongoing compliance support. Everything is coordinated by one expert team.",
    whatWeDoNot: "We don't provide legal advice, tax preparation, or accounting services. We build business infrastructure and coordinate filings, working with the appropriate agencies and professionals when needed.",
    timeline: "Business formation typically takes 24-48 hours once intake information is complete. EIN issuance is often same-day. Website and system development varies by complexity but typically takes 2-4 weeks.",
    pricing: "Pricing is customized based on your specific needs. We'll provide clear pricing and a timeline during your consultation.",
    states: "We serve businesses in all 50 states and coordinate multi-state registrations.",
    support: "We provide ongoing support including compliance monitoring, annual reports, and consultation services."
  },
  
  // Entity explanations (simplified from KB-A)
  entities: {
    llc: "An LLC (Limited Liability Company) protects your personal assets by separating business liability from personal liability. It's flexible and suitable for most small to medium businesses.",
    corp: "A corporation provides strong liability protection and can issue stock. It's often used for businesses seeking investors or planning significant growth.",
    nonprofit: "A nonprofit is organized for charitable, educational, or mission-driven purposes. It can apply for tax-exempt status."
  },
  
  // Error / fallback messages
  fallback: {
    didNotUnderstand: "I want to make sure I understand correctly. Could you rephrase that?",
    outOfScope: "That's outside what I can help with directly right now.",
    generic: "Let me collect some information and we'll address that during your consultation."
  },
  
  // Closing messages
  closing: {
    thankYou: "Thank you for chatting with me!",
    followUp: "Your consultation is confirmed.",
    anythingElse: "Is there anything else I can help you with?",
    goodbye: "Feel free to reach out anytime. Good luck with your business!"
  }
} as const;

export type Messages = typeof messages;
