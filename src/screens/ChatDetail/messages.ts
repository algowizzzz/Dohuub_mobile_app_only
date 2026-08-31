import type { ApiChatMessage } from '../../services/engagementApi';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  time: string;
};

export function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
}

export function toChatMessage(apiMessage: ApiChatMessage): ChatMessage {
  return {
    id: apiMessage.id,
    role: apiMessage.role,
    text: apiMessage.content,
    time: formatTime(new Date(apiMessage.createdAt)),
  };
}
