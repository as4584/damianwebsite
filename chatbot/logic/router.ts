/**
 * Flow Router
 * Routes user through conversation based on state and input
 */

import { messages } from '../copy/messages';
import { publicKB } from '../kb/public';
import {
  detectIntent,
  extractBusinessType,
  extractLocation,
  isPositiveResponse,
  isNegativeResponse
} from './intents';
import {
  ConversationState,
  SessionData,
  getNextState,
  saveUserMessage,
  saveBotMessage,
  shouldSkipQuestion,
  hasMinimumDataForEscalation
} from './state';
import {
  evaluateEscalation,
  getEscalationMessage,
  shouldAutoEscalate,
  EscalationType
} from './gatekeeper';
import {
  validateBusinessTypeInput,
  validateYesNoInput,
  validateLocationInput
} from './smartValidation';
import { detectAndAnswerQuestion } from './questionAnswering';

export interface ChatResponse {
  message: string;
  nextState: ConversationState;
  sessionData: SessionData;
  options?: string[];
  requiresInput?: boolean;
  showCTA?: boolean;
  ctaText?: string;
  ctaAction?: string;
}

/**
 * Main routing function
 * Processes user input and determines next response
 */
export function routeConversation(
  userInput: string,
  currentState: ConversationState,
  sessionData: SessionData
): ChatResponse {
  // Save user message to history
  sessionData = saveUserMessage(sessionData, userInput);
  
  // Check if user is asking a question (but DON'T answer yet - let Golden Frames handle it)
  const qaResult = detectAndAnswerQuestion(userInput);
  
  // Only answer questions if we're in INFO_PROVIDED state (not in active flow)
  if (qaResult.isQuestion && qaResult.answer && currentState === 'INFO_PROVIDED') {
    return {
      message: qaResult.answer,
      nextState: currentState,
      sessionData,
      requiresInput: true
    };
  }
  
  // For all other states, let Golden Frames and qualification flow handle it
  // Evaluate if we should escalate
  const escalationResult = evaluateEscalation(userInput, sessionData);
  
  // Check for auto-escalation based on collected data
  const autoEscalate = shouldAutoEscalate(sessionData);
  
  const shouldEscalate = escalationResult.shouldEscalate || autoEscalate;
  
  // Route based on current state
  let response: ChatResponse;
  
  switch (currentState) {
    case 'WELCOME':
      response = handleWelcome(userInput, sessionData);
      break;
      
    case 'INTENT_DETECTION':
      response = handleIntentDetection(userInput, sessionData);
      break;
      
    case 'BUSINESS_TYPE':
      response = handleBusinessType(userInput, sessionData);
      break;
      
    case 'ALREADY_OPERATING':
      response = handleAlreadyOperating(userInput, sessionData);
      break;
      
    case 'HAS_PARTNERS':
      response = handleHasPartners(userInput, sessionData);
      break;
      
    case 'LOCATION':
      response = handleLocation(userInput, sessionData);
      break;
      
    case 'MULTI_STATE':
      response = handleMultiState(userInput, sessionData);
      break;
      
    case 'LICENSING':
      response = handleLicensing(userInput, sessionData);
      break;
      
    case 'MISSION_DRIVEN':
      response = handleMissionDriven(userInput, sessionData);
      break;
      
    case 'SUMMARY':
      response = handleSummary(sessionData);
      break;
      
    case 'LEAD_CAPTURE_NAME':
      response = handleLeadCaptureName(userInput, sessionData);
      break;
      
    case 'LEAD_CAPTURE_EMAIL':
      response = handleLeadCaptureEmail(userInput, sessionData);
      break;
      
    case 'LEAD_CAPTURE_PHONE':
      response = handleLeadCapturePhone(userInput, sessionData);
      break;
      
    case 'ESCALATION':
      response = handleEscalation(escalationResult.escalationType, sessionData);
      break;
      
    case 'INFO_PROVIDED':
      response = handleInfoProvided(userInput, sessionData);
      break;
      
    case 'CONFIRMATION':
      response = handleConfirmation(sessionData);
      break;
      
    default:
      response = {
        message: messages.fallback.generic,
        nextState: 'SUMMARY',
        sessionData,
        requiresInput: true
      };
  }
  
  // If escalation is triggered, override next state
  if (shouldEscalate && currentState !== 'ESCALATION' && currentState !== 'SUMMARY') {
    const escalationType = escalationResult.escalationType || 'GENERIC';
    sessionData.escalationReason = escalationResult.reason;
    return handleEscalation(escalationType, sessionData);
  }
  
  // Save bot response to history
  response.sessionData = saveBotMessage(response.sessionData, response.message);
  
  return response;
}

function handleWelcome(userInput: string, sessionData: SessionData): ChatResponse {
  const intent = detectIntent(userInput);
  sessionData.intent = intent;
  
  // If user already stated intent, acknowledge and move forward
  if (intent === 'ENTITY_HELP' || userInput.toLowerCase().includes('llc') || userInput.toLowerCase().includes('business')) {
    return {
      message: "Perfect! Let me help you with that. To point you in the right direction, what type of business are you setting up? (For example: consulting, e-commerce, restaurant, etc.)",
      nextState: 'BUSINESS_TYPE',
      sessionData,
      requiresInput: true
    };
  }
  
  return {
    message: messages.welcome.initial,
    nextState: 'INTENT_DETECTION',
    sessionData,
    requiresInput: true
  };
}

function handleIntentDetection(userInput: string, sessionData: SessionData): ChatResponse {
  const intent = detectIntent(userInput);
  sessionData.intent = intent;
  
  let message = '';
  let nextState: ConversationState = 'BUSINESS_TYPE';
  
  // Check if user mentioned wanting to start/open LLC/business
  const lowerInput = userInput.toLowerCase();
  if (lowerInput.includes('llc') || lowerInput.includes('start') || lowerInput.includes('open') || lowerInput.includes('form')) {
    message = "Got it! To help you with LLC formation, what type of business are you setting up? (For example: consulting, e-commerce, restaurant, etc.)";
    nextState = 'BUSINESS_TYPE';
    return {
      message,
      nextState,
      sessionData,
      requiresInput: true
    };
  }
  
  switch (intent) {
    case 'ENTITY_HELP':
      message = messages.intents.entityHelp;
      nextState = 'BUSINESS_TYPE';
      break;
    case 'NOT_SURE':
      message = messages.intents.notSure;
      nextState = 'BUSINESS_TYPE';
      break;
    case 'PRICING':
      message = messages.intents.pricing;
      nextState = 'BUSINESS_TYPE';
      break;
    case 'CONSULTATION':
      message = messages.intents.consultation;
      nextState = 'SUMMARY';
      break;
    case 'GENERAL_INFO':
      message = messages.info.whatWeDo + '\n\n' + messages.closing.anythingElse;
      nextState = 'INFO_PROVIDED';
      break;
    case 'TIMELINE':
      message = messages.info.timeline + '\n\n' + messages.closing.anythingElse;
      nextState = 'INFO_PROVIDED';
      break;
    case 'SERVICES':
      message = messages.info.whatWeDo + '\n\n' + messages.closing.anythingElse;
      nextState = 'INFO_PROVIDED';
      break;
    default:
      message = messages.intents.notSure;
      nextState = 'BUSINESS_TYPE';
  }
  
  return {
    message,
    nextState,
    sessionData,
    requiresInput: true
  };
}

function handleBusinessType(userInput: string, sessionData: SessionData): ChatResponse {
  // Validate input first
  const validation = validateBusinessTypeInput(userInput);
  
  if (!validation.isValid) {
    return {
      message: validation.suggestedResponse!,
      nextState: 'BUSINESS_TYPE',
      sessionData,
      requiresInput: true
    };
  }
  
  // Input is valid, extract business type
  const businessType = extractBusinessType(userInput);
  if (businessType) {
    sessionData.businessType = businessType;
  }
  
  const nextMessage = messages.ack.helpful + ' ' + messages.questions.alreadyOperating;
  
  return {
    message: nextMessage,
    nextState: getNextState('BUSINESS_TYPE', sessionData, false),
    sessionData,
    requiresInput: true
  };
}

function handleAlreadyOperating(userInput: string, sessionData: SessionData): ChatResponse {
  if (isPositiveResponse(userInput)) {
    sessionData.isOperating = true;
  } else if (isNegativeResponse(userInput)) {
    sessionData.isOperating = false;
  }
  
  const nextMessage = messages.questions.hasPartners;
  
  return {
    message: nextMessage,
    nextState: getNextState('ALREADY_OPERATING', sessionData, false),
    sessionData,
    requiresInput: true,
    options: ['Yes', 'No']
  };
}

function handleHasPartners(userInput: string, sessionData: SessionData): ChatResponse {
  // Validate yes/no response
  const validation = validateYesNoInput(userInput);
  
  if (!validation.isValid) {
    return {
      message: validation.suggestedResponse! + ' ' + messages.questions.hasPartners,
      nextState: 'HAS_PARTNERS',
      sessionData,
      requiresInput: true
    };
  }
  
  if (isPositiveResponse(userInput)) {
    sessionData.hasPartners = true;
  } else if (isNegativeResponse(userInput)) {
    sessionData.hasPartners = false;
  }
  
  const nextMessage = messages.questions.location;
  
  return {
    message: nextMessage,
    nextState: getNextState('HAS_PARTNERS', sessionData, false),
    sessionData,
    requiresInput: true
  };
}

function handleLocation(userInput: string, sessionData: SessionData): ChatResponse {
  // Validate location input
  const validation = validateLocationInput(userInput);
  
  if (!validation.isValid) {
    return {
      message: validation.suggestedResponse!,
      nextState: 'LOCATION',
      sessionData,
      requiresInput: true
    };
  }
  
  const location = extractLocation(userInput);
  if (location) {
    sessionData.location = location;
  }
  
  const nextMessage = messages.ack.noted + ' ' + messages.questions.multiState;
  
  return {
    message: nextMessage,
    nextState: getNextState('LOCATION', sessionData, false),
    sessionData,
    requiresInput: true,
    options: ['Yes', 'No']
  };
}

function handleMultiState(userInput: string, sessionData: SessionData): ChatResponse {
  if (isPositiveResponse(userInput)) {
    sessionData.multiState = true;
  } else if (isNegativeResponse(userInput)) {
    sessionData.multiState = false;
  }
  
  const nextMessage = messages.questions.licensing;
  
  return {
    message: nextMessage,
    nextState: getNextState('MULTI_STATE', sessionData, false),
    sessionData,
    requiresInput: true
  };
}

function handleLicensing(userInput: string, sessionData: SessionData): ChatResponse {
  sessionData.licensing = userInput;
  
  const nextMessage = messages.ack.understood + ' ' + messages.questions.missionDriven;
  
  return {
    message: nextMessage,
    nextState: getNextState('LICENSING', sessionData, false),
    sessionData,
    requiresInput: true,
    options: ['For-profit', 'Nonprofit']
  };
}

function handleMissionDriven(userInput: string, sessionData: SessionData): ChatResponse {
  sessionData.missionDriven = userInput;
  
  // Now we have enough info, go to summary
  return {
    message: messages.ack.helpful,
    nextState: getNextState('MISSION_DRIVEN', sessionData, false),
    sessionData,
    requiresInput: false
  };
}

function handleSummary(sessionData: SessionData): ChatResponse {
  let summaryParts = [messages.summary.intro];
  
  if (sessionData.businessType) {
    summaryParts.push(messages.summary.businessType.replace('{type}', sessionData.businessType));
  }
  if (sessionData.location) {
    summaryParts.push(messages.summary.location.replace('{location}', sessionData.location));
  }
  if (sessionData.hasPartners !== undefined) {
    const ownership = sessionData.hasPartners ? 'Multiple owners' : 'Single owner';
    summaryParts.push(messages.summary.partners.replace('{ownership}', ownership));
  }
  if (sessionData.licensing) {
    summaryParts.push(messages.summary.licensing.replace('{licensing}', sessionData.licensing));
  }
  
  summaryParts.push('');
  summaryParts.push(messages.summary.outro);
  
  const summaryMessage = summaryParts.join('\n');
  
  return {
    message: summaryMessage,
    nextState: getNextState('SUMMARY', sessionData, false),
    sessionData,
    requiresInput: true,
    showCTA: true,
    ctaText: messages.ctas.scheduleConsultation,
    ctaAction: 'PROCEED_TO_LEAD_CAPTURE'
  };
}

function handleLeadCaptureName(userInput: string, sessionData: SessionData): ChatResponse {
  if (!sessionData.name) {
    // First time asking for name
    return {
      message: messages.leadCapture.name,
      nextState: 'LEAD_CAPTURE_NAME',
      sessionData,
      requiresInput: true
    };
  }
  
  // User provided name
  sessionData.name = userInput.trim();
  
  return {
    message: messages.leadCapture.email,
    nextState: getNextState('LEAD_CAPTURE_NAME', sessionData, false),
    sessionData,
    requiresInput: true
  };
}

function handleLeadCaptureEmail(userInput: string, sessionData: SessionData): ChatResponse {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userInput.trim())) {
    return {
      message: "Please provide a valid email address.",
      nextState: 'LEAD_CAPTURE_EMAIL',
      sessionData,
      requiresInput: true
    };
  }
  
  sessionData.email = userInput.trim();
  
  return {
    message: messages.leadCapture.phone,
    nextState: getNextState('LEAD_CAPTURE_EMAIL', sessionData, false),
    sessionData,
    requiresInput: true,
    options: ['Skip']
  };
}

function handleLeadCapturePhone(userInput: string, sessionData: SessionData): ChatResponse {
  const normalized = userInput.toLowerCase().trim();
  
  if (normalized !== 'skip' && userInput.trim().length > 0) {
    sessionData.phone = userInput.trim();
  }
  
  const confirmMessage = messages.leadCapture.confirm
    .replace('{name}', sessionData.name || 'there')
    .replace('{email}', sessionData.email || 'your email');
  
  return {
    message: confirmMessage,
    nextState: getNextState('LEAD_CAPTURE_PHONE', sessionData, false),
    sessionData,
    requiresInput: false
  };
}

function handleEscalation(escalationType: EscalationType, sessionData: SessionData): ChatResponse {
  const escalationMsg = getEscalationMessage(escalationType);
  
  const fullMessage = `${escalationMsg.acknowledge}\n\n${escalationMsg.explain}\n\n${escalationMsg.cta}`;
  
  return {
    message: fullMessage,
    nextState: 'SUMMARY',
    sessionData,
    requiresInput: true,
    showCTA: true,
    ctaText: messages.ctas.scheduleConsultation,
    ctaAction: 'PROCEED_TO_LEAD_CAPTURE'
  };
}

function handleInfoProvided(userInput: string, sessionData: SessionData): ChatResponse {
  const intent = detectIntent(userInput);
  
  if (intent === 'CONSULTATION' || isPositiveResponse(userInput)) {
    return {
      message: messages.intents.consultation,
      nextState: 'SUMMARY',
      sessionData,
      requiresInput: true
    };
  }
  
  // Continue conversation
  return {
    message: messages.intents.notSure,
    nextState: 'BUSINESS_TYPE',
    sessionData,
    requiresInput: true
  };
}

function handleConfirmation(sessionData: SessionData): ChatResponse {
  return {
    message: messages.closing.thankYou + '\n\n' + messages.closing.followUp,
    nextState: 'CLOSED',
    sessionData,
    requiresInput: false,
    showCTA: false
  };
}

/**
 * Get initial welcome message
 */
export function getWelcomeMessage(): ChatResponse {
  const sessionData: SessionData = {
    conversationHistory: []
  };
  
  return {
    message: messages.welcome.initial,
    nextState: 'INTENT_DETECTION',
    sessionData,
    requiresInput: true
  };
}
