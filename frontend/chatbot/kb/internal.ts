/**
 * KB-B: Internal / Restricted Knowledge Base
 * This knowledge is NEVER shown directly to users.
 * Used ONLY for escalation rules, red flags, and determining when to push consultation.
 */

export const internalKB = {
  // Escalation triggers - when to stop and push consultation
  escalationTriggers: {
    // Professional licensing requirements that need review
    licensedProfessions: [
      'medical', 'doctor', 'physician', 'dentist', 'nurse', 'healthcare',
      'lawyer', 'attorney', 'legal', 'law firm',
      'architect', 'engineer', 'cpa', 'accountant',
      'realtor', 'real estate broker', 'contractor',
      'therapist', 'counselor', 'psychologist'
    ],
    
    // Multi-state complexity
    multiStateFlags: [
      'multiple states', 'several states', 'all states', 'nationwide',
      'different states', 'other states', 'expand to', 'operate in'
    ],
    
    // Tax structure questions (require professional advice)
    taxQuestions: [
      's-corp', 's corp', 'scorp', 'tax election',
      'pass-through', 'double taxation', 'tax treatment',
      'which taxes', 'save on taxes', 'tax benefits'
    ],
    
    // Partnership complexity
    partnershipFlags: [
      'partner', 'co-owner', 'multiple owners', 'split ownership',
      'profit sharing', 'equity split', 'ownership percentage'
    ],
    
    // Uncertainty signals
    uncertaintySignals: [
      'not sure', 'don\'t know', 'unsure', 'confused',
      'which one', 'help me decide', 'what should',
      'recommend', 'best option'
    ],
    
    // Inherited or acquired businesses
    existingBusinessFlags: [
      'inherited', 'taking over', 'buying', 'acquired',
      'existing business', 'already has', 'transfer ownership'
    ],
    
    // Funding or investor situations
    fundingFlags: [
      'investors', 'investment', 'funding', 'venture capital',
      'seed round', 'angel investor', 'raising money'
    ],
    
    // Nonprofit complexity
    nonprofitFlags: [
      '501c3', '501(c)(3)', 'charity', 'foundation',
      'tax-exempt', 'donations', 'grant'
    ]
  },
  
  // Stop conditions - immediately escalate, no further questions
  stopConditions: {
    requiresLegalReview: true,
    requiresTaxAdvice: true,
    stateSpecificQuestion: true,
    complexOwnership: true,
    licensingUncertainty: true
  },
  
  // Routing rules for escalation
  escalationRouting: {
    // When user mentions licensed profession
    licensedProfession: {
      acknowledge: "I understand you're setting up a {profession} practice.",
      explain: "Professional licensing requirements vary significantly by state and profession.",
      cta: "A consultation will allow us to review the specific licensing requirements and structure recommendations for your field."
    },
    
    // When user mentions multiple states
    multiState: {
      acknowledge: "Operating in multiple states adds important considerations.",
      explain: "Multi-state businesses require coordination of registrations, compliance, and potentially different entity structures.",
      cta: "Let's schedule a consultation to review your multi-state strategy and ensure proper setup in each jurisdiction."
    },
    
    // When user asks tax questions
    taxStructure: {
      acknowledge: "Tax structure is an important decision.",
      explain: "Tax elections like S-Corp status depend on your specific income, ownership, and goals.",
      cta: "During a consultation, we can discuss tax structure options and connect you with the right advisors."
    },
    
    // When user has partners
    partnership: {
      acknowledge: "Partnership structures require careful planning.",
      explain: "Ownership splits, decision-making authority, and profit distribution should be clearly defined.",
      cta: "A consultation will help us design the right structure and agreements for your partnership."
    },
    
    // When user is uncertain
    uncertainty: {
      acknowledge: "It's completely normal to have questions about which structure is right.",
      explain: "The best choice depends on your industry, location, ownership, and long-term goals.",
      cta: "Let's schedule a consultation where we can review your specific situation and make clear recommendations."
    },
    
    // When user mentions existing business
    existingBusiness: {
      acknowledge: "Transitioning or restructuring an existing business requires careful review.",
      explain: "We need to understand the current structure, any existing obligations, and your goals.",
      cta: "A consultation will allow us to assess the situation and recommend the right approach."
    },
    
    // When user mentions funding/investors
    funding: {
      acknowledge: "Businesses seeking investment have specific structural requirements.",
      explain: "Investors typically require specific entity types and governance structures.",
      cta: "Let's schedule a consultation to discuss your funding strategy and ensure your entity structure supports it."
    },
    
    // Generic escalation
    generic: {
      acknowledge: "That's an important consideration.",
      explain: "The answer depends on details specific to your situation.",
      cta: "I can help you prepare for a consultation where we'll review all the relevant factors."
    }
  }
} as const;

export type InternalKB = typeof internalKB;
