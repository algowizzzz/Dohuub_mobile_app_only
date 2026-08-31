import { create } from 'zustand';
import {
  rewardsApi,
  referralsApi,
  type ApiRewardBalance,
  type ApiRewardHistoryEntry,
  type ApiReferral,
} from '../services/engagementApi';

export type RewardsBalance = ApiRewardBalance;

type RewardsStore = {
  balance: RewardsBalance | null;
  history: ApiRewardHistoryEntry[];
  referral: ApiReferral | null;
  loading: boolean;
  error: string | null;

  loadBalance: () => Promise<void>;
  loadHistory: (params?: { page?: number; limit?: number; kind?: string }) => Promise<void>;
  loadReferral: () => Promise<void>;
};

export const useRewardsStore = create<RewardsStore>((set) => ({
  balance: null,
  history: [],
  referral: null,
  loading: false,
  error: null,

  loadBalance: async () => {
    set({ loading: true, error: null });
    try {
      const balance = await rewardsApi.balance();
      set({ balance, loading: false });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      throw error;
    }
  },

  loadHistory: async params => {
    set({ loading: true, error: null });
    try {
      const history = await rewardsApi.history(params);
      set({ history, loading: false });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      throw error;
    }
  },

  loadReferral: async () => {
    set({ loading: true, error: null });
    try {
      const referral = await referralsApi.mine();
      set({ referral, loading: false });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      throw error;
    }
  },
}));
