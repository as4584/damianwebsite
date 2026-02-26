/**
 * Human-Centered, Deterministic Business Intake Assistant
 * REPLACES ALL PRIOR INTAKE LOGIC
 */

import { SessionData, IntakeStep, BusinessIntakeData } from './state';
import { SITE_CONTEXT } from '../kb/siteContext';
import { publicKB } from '../kb/public';

const INTAKE_SYSTEM_PROMPT = `SYSTEM ROLE: Business Intake Assistant
AUTHORITY: Absolute
MODE: Human-Centered, Deterministic Intake

KNOWLEDGE BASE:
${SITE_CONTEXT}
${JSON.stringify(publicKB)}

You are a real-world intake assistant for a business services company.
Your responsibility is to guide people calmly and kindly through a short intake so a human specialist can follow up.

You are not here to impress. You are here to help.

STRICT INTAKE FLOW:
Ask ONE question at a time. Never combine questions. Never skip steps.

1. Full legal name (REQUIRED — you cannot proceed without this)
2. Preferred name (optional)
3. Email address
4. Phone number
5. Do you already have a business name? (Yes / No)
6. What type of business are you starting? (LLC, Corporation, Sole Proprietor, Nonprofit, Not sure)
7. Do you already have an EIN? (Yes / No / Not sure)
8. Are you ready to move forward in the next 30 days? (Yes / No / Just exploring)

OFF-TOPIC & DRIFT HANDLING:
If the user asks unrelated questions or shares personal context:
1) Answer the question briefly using ONLY the KNOWLEDGE BASE provided above.
2) If the answer is not in the knowledge base, say: "That's a great question for our consultation—I want to make sure you get the most accurate answer, so I'll note that down for our team."
3) Acknowledge anything personal briefly and sincerely.
4) Gently return to the CURRENT intake question.

TONE & VOICE:
Sweet, thoughtful, empathetic
Professional and calm
Natural — like a real person doing intake
Never rushed, never robotic, never salesy.

LEAD SAVE RULE:
A lead is saved ONLY when a name exists.
If no name exists -> DO NOT SAVE.

STOP CONDITION:
Once the lead is saved or the user exits, end the conversation.`;

/**
 * Simple Regex fallbacks for when the LLM extraction fails (e.g. 401 errors)
 */
function fallbackExtraction(userInput: string, step: IntakeStep): string | null {
  const input = userInput.trim();
  
  if (step === 'EMAIL') {
    const emailMatch = input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return emailMatch ? emailMatch[0] : null;
  }
  
  if (step === 'PHONE') {
    // Basic US phone regex: handles 1234567890, 123-456-7890, (123) 456-7890
    const phoneMatch = input.match(/(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/);
    return phoneMatch ? `${phoneMatch[1]}-${phoneMatch[2]}-${phoneMatch[3]}` : null;
  }
  
  if (step === 'FULL_LEGAL_NAME' || step === 'PREFERRED_NAME') {
    // If it's 1-4 words and doesn't look like a sentence or a command
    const words = input.split(/\s+/);
    if (words.length > 0 && words.length <= 4 && !input.includes('?') && !input.includes('.') && !input.includes('@')) {
      return input;
    }
  }

  if (step === 'BUSINESS_NAME_CHECK' || step === 'EIN_STATUS') {
    if (/yes|yeah|yep|sure/i.test(input)) return 'Yes';
    if (/no|nope|not yet/i.test(input)) return 'No';
  }

  return null;
}

/**
 * Get the current question for the current step
 */
export function getIntakeQuestion(step: IntakeStep, data: BusinessIntakeData): string {
  switch (step) {
    case 'FULL_LEGAL_NAME':
      return "To get started, could you please tell me your full legal name? This is just what we'll need for official paperwork later.";
    case 'PREFERRED_NAME':
      return "Thank you. And do you have a name you prefer to go by? I want to make sure I address you correctly.";
    case 'EMAIL':
      return "Got it. What's the best email address to reach you at?";
    case 'PHONE':
      return "And a good phone number for us to have on file?";
    case 'BUSINESS_NAME_CHECK':
      return "Do you already have a business name in mind, or are you still brainstorming?";
    case 'BUSINESS_NAME_OPTIONS':
      return "I'd love to hear your ideas! What are up to three names you're considering?";
    case 'BUSINESS_TYPE':
      return "What type of business are you thinking of starting? (Like an LLC, Corporation, Sole Proprietor, or maybe you're not sure yet?)";
    case 'EIN_STATUS':
      return "Do you already have an EIN (Employer Identification Number) for this business?";
    case 'READINESS':
      return "Last question for now—are you ready to move forward in the next 30 days, or are you just exploring your options right now?";
    case 'COMPLETED':
      return "Thank you so much for sharing all of that with me. I've got everything noted down, and someone from our team will reach out to you soon to discuss the next steps. Have a wonderful day!";
    default:
      return "How can I help you today?";
  }
}

/**
 * Process user input and update intake state
 */
export async function processIntake(
  userInput: string,
  sessionData: SessionData,
  apiKey: string
): Promise<{ message: string; updatedSessionData: SessionData }> {
  if (!sessionData.businessIntake) {
    sessionData.businessIntake = {
      step: 'FULL_LEGAL_NAME',
      data: {}
    };
  }

  const { step, data } = sessionData.businessIntake;

  // 1. Use GPT to acknowledge any off-topic drift OR extract info
  // This keeps the "Human-Centered" tone while staying deterministic
  let response;
  try {
    response = await callIntakeGPT(userInput, step, data, apiKey);
  } catch (err) {
    // If GPT fails (401 etc), we use an empty response and let fallback take over
    response = { 
      naturalResponse: "I appreciate you sharing that.",
      extractedValue: null,
      moveToNextStep: false 
    };
  }
  
  // 2. Decide if we move to the next step based on the extraction
  // GPT will return both a natural response and a structured extraction
  let { naturalResponse, extractedValue, moveToNextStep } = response;

  // 3. APPLY FALLBACKS (Smart Extraction)
  // If GPT failed to extract but we see a pattern (Email/Phone), we force progress
  if (!moveToNextStep) {
    const fallbackValue = fallbackExtraction(userInput, step);
    if (fallbackValue) {
      extractedValue = fallbackValue;
      moveToNextStep = true;
      if (naturalResponse.includes("missed") || naturalResponse.includes("again")) {
        naturalResponse = "Thank you, I've got that.";
      }
    }
  }

  // 4. VALIDATION GUARD (Prevent Accidental Progression)
  // If GPT wants to move forward but we don't have a valid value for critical fields, block it.
  if (moveToNextStep) {
    if (step === 'EMAIL' && (!extractedValue || !extractedValue.includes('@'))) {
      moveToNextStep = false;
      naturalResponse = "I want to make sure I have your email correctly so our team can send you the consultation details. Could you please share your email?";
    }
    if (step === 'PHONE' && (!extractedValue || !/\d/.test(extractedValue))) {
      moveToNextStep = false;
      naturalResponse = "I'll need a phone number to reach you for the consultation. Could you please provide one?";
    }
    if (step === 'FULL_LEGAL_NAME' && !extractedValue) {
      moveToNextStep = false;
      naturalResponse = "To get started with official paperwork, I'll need your full legal name first. Could you please share that with me?";
    }
  }

  if (moveToNextStep) {
    // Update data with extracted value
    updateIntakeData(step, extractedValue, data);
    
    // Determine next step
    const nextStep = getNextStep(step, data);
    sessionData.businessIntake.step = nextStep;
    
    // If we just completed, mark it
    if (nextStep === 'COMPLETED') {
      return {
        message: `${naturalResponse} ${getIntakeQuestion('COMPLETED', data)}`.trim(),
        updatedSessionData: sessionData
      };
    }

    // The message will be the natural response + the next question
    const nextQuestion = getIntakeQuestion(nextStep, data);
    
    // Safety check: Avoid "I've got that. Could you tell me your name?" if naturalResponse already contains name logic.
    // However, usually naturalResponse is an acknowledgment like "Nice to meet you [Name]!"
    return {
      message: `${naturalResponse} ${nextQuestion}`.trim(),
      updatedSessionData: sessionData
    };
  }

  // If we didn't move to next step, it might be off-topic or clarification needed
  const currentQuestion = getIntakeQuestion(step, data);
  
  // If the response is very short or doesn't seem to acknowledge the return to topic,
  // we append the question to be safe.
  let finalMessage = naturalResponse;
  if (!naturalResponse.includes("?") && naturalResponse.length < 100) {
    finalMessage = `${naturalResponse} ${currentQuestion}`.trim();
  }

  return {
    message: finalMessage,
    updatedSessionData: sessionData
  };
}

/**
 * Call GPT for intake processing
 */
async function callIntakeGPT(
  userInput: string,
  currentStep: IntakeStep,
  data: BusinessIntakeData,
  apiKey: string
): Promise<{ naturalResponse: string; extractedValue: any; moveToNextStep: boolean }> {
  
  const currentQuestion = getIntakeQuestion(currentStep, data);
  
  const prompt = `${INTAKE_SYSTEM_PROMPT}

CURRENT STEP: ${currentStep}
CURRENT QUESTION: "${currentQuestion}"
CURRENT DATA: ${JSON.stringify(data)}

USER INPUT: "${userInput}"

TASK:
1. Acknowledge the user's input empathetically if they shared something personal or off-topic.
2. Check if the user's input provides the answer for the CURRENT STEP.
3. If yes, extract the value and set moveToNextStep to true.
4. Provide a natural, sweet response. 
5. IMPORTANT: DO NOT ask the next question in the "naturalResponse" if you are setting moveToNextStep to true. I will handle asking the next question. 
6. If the user asked a question, answer it briefly and then say something like "I've noted that for our team."

RESPOND WITH ONLY JSON:
{
  "naturalResponse": "a sweet, brief acknowledgment of the input ONLY (e.g. 'That sounds wonderful', 'Got it', 'Thanks for sharing that', 'I see')",
  "extractedValue": "the value extracted (or null)",
  "moveToNextStep": true/false
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });

    const result = await response.json();
    
    if (result.error) {
      console.error('OpenAI API Error:', JSON.stringify(result.error, null, 2));
      throw new Error(result.error.message || 'Unknown OpenAI error');
    }

    if (!result.choices || !result.choices[0]) {
      throw new Error('No choices returned from OpenAI');
    }

    const content = JSON.parse(result.choices[0].message.content);
    return content;
  } catch (error) {
    console.error('Intake GPT call failed:', error);
    return {
      naturalResponse: "I'm sorry, I missed that. Could you say it again?",
      extractedValue: null,
      moveToNextStep: false
    };
  }
}

function updateIntakeData(step: IntakeStep, value: any, data: BusinessIntakeData) {
  switch (step) {
    case 'FULL_LEGAL_NAME': data.fullLegalName = value; break;
    case 'PREFERRED_NAME': data.preferredName = value; break;
    case 'EMAIL': data.email = value; break;
    case 'PHONE': data.phone = value; break;
    case 'BUSINESS_NAME_CHECK': 
      // If user says "Yes, naming it X" or just "Naming it X", count as yes
      data.hasBusinessName = (
        value === 'Yes' || 
        value === true || 
        (typeof value === 'string' && (
          value.toLowerCase().includes('yes') || 
          value.length > 3 // Assumed a name if it's longer than a simple no
        ))
      ); 
      break;
    case 'BUSINESS_NAME_OPTIONS': 
      if (value) {
        data.businessNameOptions = Array.isArray(value) ? value.filter(Boolean) : [value]; 
      }
      break;
    case 'BUSINESS_TYPE': data.businessType = value; break;
    case 'EIN_STATUS': data.hasEIN = value; break;
    case 'READINESS': data.readiness = value; break;
  }
}

function getNextStep(currentStep: IntakeStep, data: BusinessIntakeData): IntakeStep {
  switch (currentStep) {
    case 'FULL_LEGAL_NAME': return 'PREFERRED_NAME';
    case 'PREFERRED_NAME': return 'EMAIL';
    case 'EMAIL': return 'PHONE';
    case 'PHONE': return 'BUSINESS_NAME_CHECK';
    case 'BUSINESS_NAME_CHECK': 
      return data.hasBusinessName ? 'BUSINESS_NAME_OPTIONS' : 'BUSINESS_TYPE';
    case 'BUSINESS_NAME_OPTIONS': return 'BUSINESS_TYPE';
    case 'BUSINESS_TYPE': return 'EIN_STATUS';
    case 'EIN_STATUS': return 'READINESS';
    case 'READINESS': return 'COMPLETED';
    default: return 'COMPLETED';
  }
}
