/**
 * Chatbot CLI Tester
 * Use this to talk to the Business Intake Assistant in your terminal.
 */

import 'dotenv/config';
import * as readline from 'readline';
import { routeConversationEnhanced } from '../frontend/chatbot/logic/routerEnhanced';
import { SessionData, initializeState } from '../frontend/chatbot/logic/state';

const DEBUG = process.argv.includes('--debug');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const initialState = initializeState();
let sessionData: SessionData = initialState.sessionData;
let currentState = initialState.currentState;

console.log("\n====================================================");
console.log("🚀 BUSINESS INTAKE ASSISTANT - TERMINAL TESTER");
console.log("====================================================\n");

async function chat() {
  // If first turn, get the welcome message
  if (!sessionData.bootstrapCompleted) {
    const response = await routeConversationEnhanced('', currentState, sessionData);
    console.log(`\x1b[36mAssistant:\x1b[0m ${response.message}\n`);
    sessionData = response.sessionData;
    currentState = response.nextState;
  }

  rl.question('\x1b[32mYou:\x1b[0m ', async (userInput) => {
    if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
      console.log("\nGoodbye! Have a sweet day. 😊");
      rl.close();
      return;
    }

    try {
      if (DEBUG) {
        console.log(`[DEBUG] Input: "${userInput}", State: ${currentState}`);
      }

      const response = await routeConversationEnhanced(userInput, currentState, sessionData);
      
      console.log(`\n\x1b[36mAssistant:\x1b[0m ${response.message}\n`);
      
      if (DEBUG) {
        console.log(`[DEBUG] Next State: ${response.nextState}`);
        console.log(`[DEBUG] Intake Step: ${sessionData.businessIntake?.step || 'N/A'}`);
      }

      sessionData = response.sessionData;
      currentState = response.nextState;

      if (currentState === 'CONFIRMATION' || currentState === 'CLOSED') {
        console.log("\n====================================================");
        console.log("✅ INTAKE COMPLETED");
        console.log("====================================================\n");
        console.log("Extracted Data:");
        console.log(JSON.stringify(sessionData.businessIntake?.data, null, 2));
        console.log("\n");
        rl.close();
        process.exit(0);
      } else {
        chat();
      }
    } catch (error) {
      console.error("\n\x1b[31m❌ Error:\x1b[0m", error);
      if (DEBUG && error instanceof Error) {
        console.error(error.stack);
      }
      // Check if stdin is still open before restarting
      if (!process.stdin.closed && !process.stdin.destroyed) {
        console.log("\nRestarting conversation...\n");
        chat();
      } else {
        rl.close();
      }
    }
  });
}

chat();
