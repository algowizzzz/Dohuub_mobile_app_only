import { create } from 'zustand';
import { addressesApi, type ApiAddress, type ApiAddressType } from '../services/accountApi';

type AddressStore = {
  addresses: ApiAddress[];
  loading: boolean;
  error: string | null;

  load: () => Promise<void>;
  addAddress: (payload: {
    address: string;
    type: ApiAddressType;
    city?: string;
    state?: string;
    zipCode?: string;
    instructions?: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
  }) => Promise<void>;
  updateAddress: (id: string, payload: Partial<Parameters<AddressStore['addAddress']>[0]>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
};

export const useAddressStore = create<AddressStore>((set) => ({
  addresses: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const addresses = await addressesApi.list();
      set({ addresses, loading: false });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      throw error;
    }
  },

  addAddress: async payload => {
    const created = await addressesApi.create(payload);
    set(state => ({
      addresses: created.isDefault
        ? [...state.addresses.map(a => ({ ...a, isDefault: false })), created]
        : [...state.addresses, created],
    }));
  },

  updateAddress: async (id, payload) => {
    const updated = await addressesApi.update(id, payload);
    set(state => ({
      addresses: state.addresses.map(address => (address.id === id ? updated : address)),
    }));
  },

  removeAddress: async id => {
    await addressesApi.remove(id);
    set(state => {
      const target = state.addresses.find(a => a.id === id);
      const remaining = state.addresses.filter(a => a.id !== id);
      if (target?.isDefault && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return { addresses: remaining };
    });
  },

  setDefault: async id => {
    await addressesApi.setDefault(id);
    set(state => ({
      addresses: state.addresses.map(address => ({ ...address, isDefault: address.id === id })),
    }));
  },
}));
