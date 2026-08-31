import { create } from 'zustand';
import { cardsApi, type ApiCard } from '../services/accountApi';

type PaymentCardStore = {
  cards: ApiCard[];
  loading: boolean;
  error: string | null;

  load: () => Promise<void>;
  addCard: (payload: {
    paymentMethodId: string;
    cardHolderName?: string;
    isDefault?: boolean;
  }) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
  removeCard: (id: string) => Promise<void>;
};

export const usePaymentCardStore = create<PaymentCardStore>((set) => ({
  cards: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const cards = await cardsApi.list();
      set({ cards, loading: false });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      throw error;
    }
  },

  addCard: async payload => {
    const created = await cardsApi.save(payload);
    set(state => ({
      cards: created.isDefault
        ? [...state.cards.map(card => ({ ...card, isDefault: false })), created]
        : [...state.cards, created],
    }));
  },

  setDefault: async id => {
    await cardsApi.setDefault(id);
    set(state => ({
      cards: state.cards.map(card => ({ ...card, isDefault: card.id === id })),
    }));
  },

  removeCard: async id => {
    await cardsApi.remove(id);
    set(state => {
      const target = state.cards.find(card => card.id === id);
      const remaining = state.cards.filter(card => card.id !== id);
      if (target?.isDefault && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return { cards: remaining };
    });
  },
}));
