/**
 * Formats a Date object to a 12-hour time string (e.g., "3:45 PM")
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
