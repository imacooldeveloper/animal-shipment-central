
import { ShipmentNote } from '@/types';

/**
 * Utility to safely parse notes from various formats into a consistent array format
 * @param notesInput Notes data which could be a string, array, or null
 * @returns Array of ShipmentNote objects
 */
export function parseNotesData(notesInput: ShipmentNote[] | string | null): ShipmentNote[] {
  // If null or undefined, return empty array
  if (!notesInput) {
    return [];
  }
  
  // If already an array, return it directly
  if (Array.isArray(notesInput)) {
    return notesInput;
  }
  
  // If it's a string, try to parse it as JSON
  try {
    const parsed = JSON.parse(notesInput);
    // Check if the parsed result is an array
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    // JSON parsing failed, not a JSON string - continue to fallback
  }
  
  // If we get here, it's either a plain string or JSON parsing failed
  // Create a single note object
  return [{
    id: crypto.randomUUID(),
    content: notesInput,
    created_at: new Date().toISOString(),
    user_name: 'System'
  }];
}

/**
 * Formats a date string to a human-readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatNoteDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  } catch (e) {
    return dateString;
  }
}
