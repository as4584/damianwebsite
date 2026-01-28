/**
 * Scheduling Logic - Time Slot Selection
 * NO LLM calls - purely deterministic
 * 
 * PURPOSE: Complete the consultation booking with actual time selection
 */

import { SessionData } from './state';

/**
 * Business hours: Monday-Friday, 9 AM - 5 PM EST
 */
const BUSINESS_HOURS = {
  start: 9,   // 9 AM
  end: 17,    // 5 PM
  timezone: 'America/New_York'
};

/**
 * Generate available time slots for the next 5 business days
 */
export function generateAvailableSlots(): Array<{ date: string; time: string; display: string }> {
  const slots: Array<{ date: string; time: string; display: string }> = [];
  const now = new Date();
  let daysChecked = 0;
  let slotsAdded = 0;
  
  // Generate slots for next 5 business days
  while (slotsAdded < 15 && daysChecked < 10) {
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() + daysChecked + 1); // Start from tomorrow
    
    const dayOfWeek = checkDate.getDay();
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Add 3 slots per day: 10am, 1pm, 3pm
      const times = [
        { hour: 10, minute: 0, display: '10:00 AM' },
        { hour: 13, minute: 0, display: '1:00 PM' },
        { hour: 15, minute: 0, display: '3:00 PM' }
      ];
      
      times.forEach(({ hour, minute, display }) => {
        const slotDate = new Date(checkDate);
        slotDate.setHours(hour, minute, 0, 0);
        
        slots.push({
          date: slotDate.toISOString().split('T')[0], // YYYY-MM-DD
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`, // HH:MM
          display: `${checkDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at ${display}`
        });
        
        slotsAdded++;
      });
    }
    
    daysChecked++;
  }
  
  return slots.slice(0, 15); // Return max 15 slots
}

/**
 * Parse user input to detect time slot selection
 */
export function detectTimeSlotSelection(userInput: string): number | null {
  const lowerInput = userInput.toLowerCase().trim();
  
  // Match slot numbers like "1", "slot 1", "#1", "option 1"
  const slotMatch = lowerInput.match(/(?:slot|option|#)?\s*(\d+)/);
  if (slotMatch) {
    const slotNum = parseInt(slotMatch[1], 10);
    return slotNum;
  }
  
  return null;
}

/**
 * Format time slots for display
 */
export function formatTimeSlotsMessage(slots: Array<{ date: string; time: string; display: string }>): string {
  let message = "Great! Here are the available times:\n\n";
  
  slots.forEach((slot, index) => {
    message += `${index + 1}. ${slot.display}\n`;
  });
  
  message += "\nJust reply with the number of your preferred slot (e.g., \"1\" or \"slot 3\").";
  
  return message;
}

/**
 * Validate and confirm selected time slot
 */
export function confirmTimeSlot(
  slotNumber: number,
  availableSlots: Array<{ date: string; time: string; display: string }>
): {
  success: boolean;
  selectedSlot?: { date: string; time: string; display: string };
  error?: string;
} {
  if (slotNumber < 1 || slotNumber > availableSlots.length) {
    return {
      success: false,
      error: `Please select a number between 1 and ${availableSlots.length}.`
    };
  }
  
  const selectedSlot = availableSlots[slotNumber - 1];
  
  return {
    success: true,
    selectedSlot
  };
}

/**
 * Check if scheduling phase should activate
 * Requires all intake fields + no time selected yet
 */
export function shouldEnterScheduling(sessionData: SessionData): boolean {
  if (!sessionData.consultation) return false;
  
  // Check if all intake fields are collected
  const hasAllFields = Boolean(
    sessionData.consultation.userName &&
    sessionData.consultation.userEmail &&
    sessionData.consultation.businessType &&
    sessionData.consultation.businessGoal
  );
  
  // Check if time not yet selected
  const noTimeSelected = !sessionData.consultation.scheduledSlot;
  
  return hasAllFields && noTimeSelected;
}

/**
 * Persist consultation with scheduled time
 */
export async function persistConsultationWithSchedule(
  sessionData: SessionData
): Promise<{ success: boolean; consultationId?: string }> {
  // TODO: Integrate with actual backend/database
  console.log('[Scheduling] Persisting consultation with schedule:', {
    ...sessionData.consultation,
    confirmedAt: Date.now()
  });
  
  return {
    success: true,
    consultationId: `CONSULT_${Date.now()}`
  };
}

/**
 * Get confirmation message after scheduling
 */
export function getSchedulingConfirmationMessage(
  userName: string,
  selectedSlot: { display: string },
  consultationId?: string
): string {
  return `Perfect, ${userName}! I've scheduled your consultation for ${selectedSlot.display}. You'll receive a confirmation email shortly. Your confirmation number is ${consultationId || 'pending'}.`;
}
