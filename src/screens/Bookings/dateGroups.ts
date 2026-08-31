export type DateGroup = 'Today' | 'Tomorrow' | 'This week' | 'Later' | 'Past';

export function getDateGroup(scheduledDate: string): DateGroup {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(`${scheduledDate}T00:00:00`);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) return 'Past';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return 'This week';
  return 'Later';
}

export const DATE_GROUP_ORDER: DateGroup[] = ['Today', 'Tomorrow', 'This week', 'Later', 'Past'];
