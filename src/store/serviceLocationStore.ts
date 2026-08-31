import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Coords = { lat: number; lng: number };

type ServiceLocationStore = {
  selectedAddressId: string | null;
  lastCoords: Coords | null;
  countryIso: string | null;
  setSelectedAddressId: (id: string) => void;
  setLastCoords: (coords: Coords | null) => void;
  setCountryIso: (iso: string | null) => void;
};

export const useServiceLocationStore = create<ServiceLocationStore>()(
  persist(
    set => ({
      selectedAddressId: null,
      lastCoords: null,
      countryIso: null,
      setSelectedAddressId: id => set({ selectedAddressId: id }),
      setLastCoords: coords => set({ lastCoords: coords }),
      setCountryIso: iso => set({ countryIso: iso }),
    }),
    {
      name: 'dohuub-service-location',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        selectedAddressId: state.selectedAddressId,
        lastCoords: state.lastCoords,
        countryIso: state.countryIso,
      }),
    },
  ),
);
