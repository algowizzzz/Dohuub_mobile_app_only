import { del, get, patch, post } from './http';

export type ApiRewardBalance = {
  balance: number;
  lifetimePoints: number;
  value: number;
  conversion: { pointsPerCurrencyUnit: number; minimumRedeemable: number };
  milestones: Array<{ id: string; points: number; reward: string; unlocked: boolean }>;
  unlockedCount: number;
  nextMilestone: { id: string; points: number; reward: string; pointsAway: number } | null;
  /** Consecutive weeks (including this one) with a completed booking. */
  weeklyStreak: number;
};

export type ApiRewardHistoryEntry = {
  id: string;
  label: string;
  kind: 'earned' | 'redeemed' | 'returned';
  points: number;
  balanceAfter: number;
  createdAt: string;
  booking?: { id: string; reference: string } | null;
};

type RawHistoryEntry = {
  id: string;
  label?: string;
  kind?: string;
  reason?: string;
  entryType?: string;
  points: number;
  balanceAfter: number;
  createdAt: string;
  booking?: { id: string; reference: string } | null;
};

function mapHistoryKind(value?: string): ApiRewardHistoryEntry['kind'] {
  if (value === 'redeemed') return 'redeemed';
  if (value === 'adjusted' || value === 'returned') return 'returned';
  return 'earned';
}

export function normalizeHistoryEntry(raw: RawHistoryEntry): ApiRewardHistoryEntry {
  return {
    id: raw.id,
    label: raw.label || raw.reason || 'Points',
    kind: mapHistoryKind(raw.kind ?? raw.entryType),
    points: Math.abs(Number(raw.points) || 0),
    balanceAfter: raw.balanceAfter,
    createdAt: raw.createdAt,
    booking: raw.booking ?? null,
  };
}

export type ApiMilestone = {
  id: string;
  title: string;
  pointsRequired: number;
};

export const rewardsApi = {
  balance: () => get<ApiRewardBalance>('/rewards/me'),
  history: (params?: { page?: number; limit?: number; kind?: string }) =>
    get<RawHistoryEntry[] | { items?: RawHistoryEntry[] }>('/rewards/me/history', { params }).then(
      payload => {
        const entries = Array.isArray(payload) ? payload : payload?.items ?? [];
        return entries.map(normalizeHistoryEntry);
      },
    ),
  milestones: () =>
    get<{ milestones: ApiMilestone[] }>('/rewards/milestones', { skipAuth: true }).then(
      r => r.milestones,
    ),
};

export type ApiReferralInvite = {
  id: string;
  referrerId: string;
  refereeId: string;
  status: 'pending' | 'qualified';
  referrerPoints: number;
  refereePoints: number;
  createdAt: string;
  qualifiedAt: string | null;
  referee: { id: string; fullName: string; email: string; image: string | null; createdAt: string };
};

export type ApiReferral = {
  referralCode: string;
  rewards: { referrerPoints: number; refereePoints: number };
  summary: { invited: number; qualified: number; pending: number; pointsEarned: number };
  invites: ApiReferralInvite[];
};

export const referralsApi = {
  mine: (params?: { page?: number; limit?: number }) =>
    get<ApiReferral>('/referrals/me', { params }),
  preview: (code: string) =>
    get<{ valid: boolean; referrerName: string | null; refereePoints: number }>(
      '/referrals/preview',
      { skipAuth: true, params: { code } },
    ),
  attach: (code: string) => post<{ attached: boolean; refereePoints: number; referrerPoints: number }>('/referrals/attach', { code }),
};

export type ApiChatMessage = {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export type ApiConversation = {
  id: string;
  userId: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  messages: ApiChatMessage[];
  _count?: { messages: number };
};

export const chatApi = {
  list: (params?: { page?: number; limit?: number }) =>
    get<ApiConversation[]>('/conversations', { params }),
  get: (id: string) =>
    get<{ conversation: ApiConversation }>(`/conversations/${id}`).then(r => r.conversation),
  create: (message?: string) =>
    post<{ conversation: ApiConversation }>('/conversations', { message }).then(
      r => r.conversation,
    ),
  send: (id: string, content: string) =>
    post<{ conversation: ApiConversation }>(`/conversations/${id}/messages`, { content }).then(
      r => r.conversation,
    ),
  remove: (id: string) => del<void>(`/conversations/${id}`),
};

export type ApiNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  batchId: string | null;
  readAt: string | null;
  createdAt: string;
};

export const notificationsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    get<ApiNotification[]>('/notifications', { params }),
  markRead: (id: string) => patch<void>(`/notifications/${id}/read`, {}),
  markAllRead: () => post<void>('/notifications/read-all', {}),
  registerDevice: (payload: { token: string; platform: 'ios' | 'android' }) =>
    post<{ device: Record<string, unknown> }>('/notifications/devices', payload).then(
      r => r.device,
    ),
  unregisterDevice: (token: string) => del<void>('/notifications/devices', { data: { token } } as never),
};
