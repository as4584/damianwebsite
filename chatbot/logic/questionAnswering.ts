/**
 * Question Answering System
 * Detects and answers questions about the business and website
 */

interface QAResult {
  isQuestion: boolean;
  answer?: string;
  shouldContinueFlow?: boolean;
}

/**
 * Website navigation questions
 */
const navigationQA: Record<string, string> = {
  'where': 'You can find information throughout the site:\n• Services page (/services) - All our offerings\n• Starting a Business (/starting-a-business) - Formation guides\n• Who We Serve (/who-we-serve) - Client types\n• Contact (/contact) - Get in touch\n\nWhat specifically are you looking for?',
  
  'services page': 'The Services page (/services) shows everything we offer: business formation, compliance, websites, custom apps, AI tools, and more. Click "Services" in the nav bar!',
  
  'contact': 'You can reach us through the Contact page (/contact) or I can help you schedule a consultation right now. Which would you prefer?',
  
  'pricing': 'Pricing depends on what you need. For example:\n• Basic LLC formation starts around $500-1000\n• Multi-state setup varies by states\n• Websites and custom apps are quoted based on scope\n\nWant to tell me what you need so I can give you a better estimate?'
};

/**
 * Business formation questions
 */
const formationQA: Record<string, string> = {
  'formation': 'Business formation is the legal process of officially creating your business entity. This includes:\n• Choosing entity type (LLC, S-Corp, etc.)\n• Filing paperwork with your state\n• Getting an EIN from the IRS\n• Setting up compliance (registered agent, etc.)\n\nWe handle all of this. Are you looking to form a new business?',
  
  'llc': 'An LLC (Limited Liability Company) protects your personal assets from business debts. It\'s the most popular choice for small businesses because:\n• Personal liability protection\n• Tax flexibility (pass-through or corp taxation)\n• Less paperwork than a corporation\n• Works for solo or partners\n\nThinking about starting an LLC?',
  
  's-corp': 'An S-Corp is a tax election that can save you money on self-employment taxes. You can elect S-Corp status for an LLC or corporation. Good for businesses making $60k+ profit. Want to know if it\'s right for you?',
  
  'ein': 'An EIN (Employer Identification Number) is like a social security number for your business. You need it to:\n• Open a business bank account\n• Hire employees\n• File taxes\n\nWe get this for you as part of formation.',
  
  'registered agent': 'A registered agent receives legal documents for your business. Required in every state you operate. We provide registered agent service in all 50 states as part of our compliance package.',
  
  'compliance': 'Business compliance includes:\n• Annual reports (varies by state)\n• Registered agent service\n• BOI filing (federal requirement)\n• Maintaining good standing\n\nWe handle all of this so you don\'t have to worry about it.'
};

/**
 * About the company/service questions
 */
const companyQA: Record<string, string> = {
  'who are you': 'I\'m the assistant for Innovation Business Development Solutions. We\'re a national business infrastructure firm - we handle formation, compliance, websites, custom apps, AI tools, and everything else you need to run and scale a business. Think of us as your operational backbone.',
  
  'what do you do': 'We provide complete business infrastructure:\n• Formation: LLCs, S-Corps, multi-state registration\n• Compliance: Registered agents, annual reports, BOI filing\n• Digital: Websites, custom applications, AI integration\n• Infrastructure: Email systems, domains, tech stack\n\nEverything coordinated by one team. What interests you?',
  
  'custom app': 'We build custom business applications tailored to your needs:\n• Internal tools and dashboards\n• Customer portals\n• Automation and workflows\n• API integrations\n• AI-powered features\n\nThese replace expensive SaaS tools with exactly what you need. What kind of app are you thinking about?',
  
  'website': 'We build professional business websites:\n• Custom design (not templates)\n• Mobile-responsive\n• SEO optimized\n• Fast and secure\n• Connected to your business systems\n\nDomain, hosting, and maintenance included. Need a new site or redesign?',
  
  'ai tool': 'We integrate AI into your business:\n• Custom chatbots (like me!)\n• Document processing\n• Data analysis\n• Workflow automation\n• Customer service tools\n\nWe build AI that actually solves problems. Interested?',
  
  'how does this work': 'Super simple:\n1. Tell me what you need (or I\'ll ask questions to figure it out)\n2. We give you a clear plan and pricing\n3. We handle everything - formation, tech, compliance\n4. You focus on your business, we handle the infrastructure\n\nWant to get started?',
  
  'recreate': 'Want to build a chat system like me? We build custom AI assistants and automation for businesses. This includes:\n• Custom chatbots for your site\n• AI-powered workflows\n• Integration with your systems\n\nInterested in discussing a custom AI solution?'
};

/**
 * Detect and answer questions
 */
export function detectAndAnswerQuestion(userInput: string): QAResult {
  const lower = userInput.toLowerCase().trim();
  
  // Normalize variations (u -> you, etc)
  const normalized = lower
    .replace(/\bu\b/g, 'you')
    .replace(/\bur\b/g, 'your')
    .replace(/\br\b/g, 'are');
  
  // Check if it's a question
  const questionMarkers = ['what', 'how', 'why', 'when', 'where', 'who', 'can you', 'do you', 'tell me', 'explain'];
  const isQuestion = questionMarkers.some(q => normalized.startsWith(q)) || normalized.includes('?');
  
  if (!isQuestion) {
    return { isQuestion: false };
  }
  
  // Check website navigation questions
  for (const [keyword, answer] of Object.entries(navigationQA)) {
    if (normalized.includes(keyword)) {
      return {
        isQuestion: true,
        answer,
        shouldContinueFlow: true
      };
    }
  }
  
  // Check formation questions
  for (const [keyword, answer] of Object.entries(formationQA)) {
    if (normalized.includes(keyword)) {
      return {
        isQuestion: true,
        answer,
        shouldContinueFlow: true
      };
    }
  }
  
  // Check company/service questions
  for (const [keyword, answer] of Object.entries(companyQA)) {
    if (normalized.includes(keyword)) {
      return {
        isQuestion: true,
        answer,
        shouldContinueFlow: true
      };
    }
  }
  
  // Generic question we can't answer specifically
  if (isQuestion) {
    return {
      isQuestion: true,
      answer: "Good question! I can help with business formation, compliance, websites, and custom apps. What specifically would you like to know?",
      shouldContinueFlow: false
    };
  }
  
  return { isQuestion: false };
}
