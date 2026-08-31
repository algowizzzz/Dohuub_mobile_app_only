import type { ApiVendorDetail } from '../../services/catalogApi';

export function formatServiceArea(
  vendor: Pick<ApiVendorDetail, 'city' | 'state' | 'address' | 'serviceRadiusKm'>,
): string {
  const place = [vendor.city, vendor.state].filter(Boolean).join(', ');
  if (place && vendor.serviceRadiusKm) return `${place} & Surrounding Areas`;
  if (place) return place;
  return vendor.address || 'Local area';
}