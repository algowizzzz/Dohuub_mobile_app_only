export function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
}

/** Longer label for vendor profile service cards, e.g. "2 hours". */
export function formatDurationHours(minutes: number): string {
  if (minutes <= 0) return '';
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  if (Number.isInteger(hours)) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }
  const whole = Math.floor(hours);
  const remainder = minutes % 60;
  if (remainder === 30) return `${whole}.5 hours`;
  return `${whole}h ${remainder}m`;
}
