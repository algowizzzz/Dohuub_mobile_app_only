import type { ApiAddress, ApiAddressType } from '../../services/accountApi';

export type { ApiAddress as Address, ApiAddressType as AddressType };

export const ADDRESS_TYPE_META: Record<ApiAddressType, { label: string; icon: string }> = {
  home: { label: 'Home', icon: 'home-outline' },
  work: { label: 'Work', icon: 'briefcase-outline' },
  other: { label: 'Other', icon: 'location-outline' },
};

export function formatAddressLine(address: ApiAddress): string {
  const parts = [address.address, address.city, address.state, address.zipCode].filter(Boolean);
  return parts.join(', ');
}
