/**
 * Smart Input Validation
 * Detects when user input is off-topic, unclear, or needs clarification
 */

export interface ValidationResult {
  isValid: boolean;
  reason?: 'off_topic' | 'unclear' | 'profanity' | 'illegal' | 'greeting' | 'question';
  suggestedResponse?: string;
}

/**
 * Check if input is just a greeting
 */
export function isGreeting(input: string): boolean {
  const greetings = ['hi', 'hello', 'hey', 'sup', 'yo', 'greetings', 'howdy'];
  const lower = input.toLowerCase().trim();
  return greetings.some(g => lower === g || lower.startsWith(g + ' '));
}

/**
 * Check if input is profanity or nonsense
 */
export function isProfanityOrNonsense(input: string): boolean {
  const nonsense = ['fart', 'poop', 'butt', 'asdf', 'qwerty', 'test', 'testing'];
  const lower = input.toLowerCase().trim();
  return nonsense.some(n => lower.includes(n)) || input.length < 2;
}

/**
 * Check if user is asking about illegal activities
 */
export function isIllegalActivity(input: string): boolean {
  const illegal = ['weed', 'cannabis', 'marijuana', 'drugs', 'cocaine', 'meth'];
  const lower = input.toLowerCase();
  return illegal.some(i => lower.includes(i));
}

/**
 * Check if user is asking a question instead of answering
 */
export function isQuestion(input: string): boolean {
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'can you', 'do you'];
  const lower = input.toLowerCase().trim();
  return questionWords.some(q => lower.startsWith(q)) || input.trim().endsWith('?');
}

/**
 * Check if answer is too vague for business type
 */
export function isVagueBusinessType(input: string): boolean {
  const vague = ['business', 'company', 'stuff', 'things', 'idk', 'dunno', 'not sure'];
  const lower = input.toLowerCase().trim();
  return vague.some(v => lower === v || lower.includes(v)) && input.length < 20;
}

/**
 * Validate business type input
 */
export function validateBusinessTypeInput(input: string): ValidationResult {
  if (isGreeting(input)) {
    return {
      isValid: false,
      reason: 'greeting',
      suggestedResponse: "Hey! I'm here to help. So, what type of business are you thinking about? (Like consulting, e-commerce, restaurant, etc.)"
    };
  }

  if (isProfanityOrNonsense(input)) {
    return {
      isValid: false,
      reason: 'profanity',
      suggestedResponse: "I want to help you, but I need a real answer. What type of business are you looking to start?"
    };
  }

  if (isIllegalActivity(input)) {
    return {
      isValid: false,
      reason: 'illegal',
      suggestedResponse: "I can't help with businesses in that industry. We work with legal business formations. If you have a different business idea, I'm here to help!"
    };
  }

  if (isQuestion(input)) {
    return {
      isValid: false,
      reason: 'question',
      suggestedResponse: "Good question! Let me answer that first, then we'll continue. What specifically do you want to know?"
    };
  }

  if (isVagueBusinessType(input)) {
    return {
      isValid: false,
      reason: 'unclear',
      suggestedResponse: "Can you be more specific? For example: online consulting, e-commerce store, local restaurant, real estate, marketing agency, etc."
    };
  }

  return { isValid: true };
}

/**
 * Validate yes/no responses
 */
export function validateYesNoInput(input: string): ValidationResult {
  const lower = input.toLowerCase().trim();
  const yes = ['yes', 'yeah', 'yep', 'sure', 'yup', 'y'];
  const no = ['no', 'nope', 'nah', 'n'];

  if (yes.some(y => lower === y || lower.startsWith(y + ' '))) {
    return { isValid: true };
  }

  if (no.some(n => lower === n || lower.startsWith(n + ' '))) {
    return { isValid: true };
  }

  if (isGreeting(input) || isProfanityOrNonsense(input)) {
    return {
      isValid: false,
      reason: 'unclear',
      suggestedResponse: "I need a yes or no. Let me ask again:"
    };
  }

  return {
    isValid: false,
    reason: 'unclear',
    suggestedResponse: "I didn't catch that. Could you answer with yes or no?"
  };
}

/**
 * Validate location input
 */
export function validateLocationInput(input: string): ValidationResult {
  if (isGreeting(input) || isProfanityOrNonsense(input)) {
    return {
      isValid: false,
      reason: 'unclear',
      suggestedResponse: "I need to know where you're located. What state or city?"
    };
  }

  if (input.trim().length < 2) {
    return {
      isValid: false,
      reason: 'unclear',
      suggestedResponse: "Can you tell me which state or city?"
    };
  }

  return { isValid: true };
}
