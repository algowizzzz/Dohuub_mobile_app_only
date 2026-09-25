import { useAddressStore } from '../store/addressStore';
import { useServiceLocationStore } from '../store/serviceLocationStore';

/**
 * Lat/lng for catalog “near me” queries: the selected address, else the
 * default (then first) saved address, then last GPS — same order as the PWA.
 */
export function getNearMeCoords(): { lat: number; lng: number } | undefined {
  const { selectedAddressId, lastCoords } = useServiceLocationStore.getState();
  const addresses = useAddressStore.getState().addresses;
  const selected =
    addresses.find(address => address.id === selectedAddressId) ??
    addresses.find(address => address.isDefault) ??
    addresses[0];
  const lat = selected?.latitude ?? lastCoords?.lat ?? null;
  const lng = selected?.longitude ?? lastCoords?.lng ?? null;
  if (lat == null || lng == null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) {
    return undefined;
  }
  return { lat: Number(lat), lng: Number(lng) };
}
