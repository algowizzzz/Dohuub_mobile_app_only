export type CountryDial = {
  iso: string;
  name: string;
  dial: string;
  min: number;
  max: number;
};

export const COUNTRIES: CountryDial[] = [
  { iso: 'PK', name: 'Pakistan', dial: '+92', min: 10, max: 10 },
  { iso: 'US', name: 'United States', dial: '+1', min: 10, max: 10 },
  { iso: 'CA', name: 'Canada', dial: '+1', min: 10, max: 10 },
  { iso: 'GB', name: 'United Kingdom', dial: '+44', min: 10, max: 11 },
  { iso: 'AE', name: 'United Arab Emirates', dial: '+971', min: 9, max: 9 },
  { iso: 'SA', name: 'Saudi Arabia', dial: '+966', min: 9, max: 9 },
  { iso: 'IN', name: 'India', dial: '+91', min: 10, max: 10 },
  { iso: 'AU', name: 'Australia', dial: '+61', min: 9, max: 9 },
  { iso: 'DE', name: 'Germany', dial: '+49', min: 10, max: 11 },
  { iso: 'FR', name: 'France', dial: '+33', min: 9, max: 9 },
  { iso: 'IT', name: 'Italy', dial: '+39', min: 9, max: 10 },
  { iso: 'ES', name: 'Spain', dial: '+34', min: 9, max: 9 },
  { iso: 'NL', name: 'Netherlands', dial: '+31', min: 9, max: 9 },
  { iso: 'TR', name: 'Turkey', dial: '+90', min: 10, max: 10 },
  { iso: 'EG', name: 'Egypt', dial: '+20', min: 10, max: 10 },
  { iso: 'NG', name: 'Nigeria', dial: '+234', min: 10, max: 10 },
  { iso: 'KE', name: 'Kenya', dial: '+254', min: 9, max: 9 },
  { iso: 'ZA', name: 'South Africa', dial: '+27', min: 9, max: 9 },
  { iso: 'BD', name: 'Bangladesh', dial: '+880', min: 10, max: 10 },
  { iso: 'PH', name: 'Philippines', dial: '+63', min: 10, max: 10 },
  { iso: 'MY', name: 'Malaysia', dial: '+60', min: 9, max: 10 },
  { iso: 'SG', name: 'Singapore', dial: '+65', min: 8, max: 8 },
  { iso: 'ID', name: 'Indonesia', dial: '+62', min: 9, max: 12 },
  { iso: 'CN', name: 'China', dial: '+86', min: 11, max: 11 },
  { iso: 'JP', name: 'Japan', dial: '+81', min: 10, max: 10 },
  { iso: 'KR', name: 'South Korea', dial: '+82', min: 9, max: 10 },
  { iso: 'BR', name: 'Brazil', dial: '+55', min: 10, max: 11 },
  { iso: 'MX', name: 'Mexico', dial: '+52', min: 10, max: 10 },
  { iso: 'QA', name: 'Qatar', dial: '+974', min: 8, max: 8 },
  { iso: 'KW', name: 'Kuwait', dial: '+965', min: 8, max: 8 },
  { iso: 'OM', name: 'Oman', dial: '+968', min: 8, max: 8 },
  { iso: 'BH', name: 'Bahrain', dial: '+973', min: 8, max: 8 },
];

export function countryFromIso(iso?: string | null): CountryDial {
  const match = COUNTRIES.find(c => c.iso === (iso || '').toUpperCase());
  return match ?? COUNTRIES[0];
}

export function countryFromDial(dial: string): CountryDial | undefined {
  const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  return sorted.find(c => dial.startsWith(c.dial));
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function splitE164(value: string): { country: CountryDial; local: string } {
  const trimmed = value.replace(/\s/g, '');
  const country = countryFromDial(trimmed);
  if (country) {
    return { country, local: trimmed.slice(country.dial.length).replace(/\D/g, '') };
  }
  return { country: countryFromIso(), local: digitsOnly(trimmed.replace(/^\+/, '')) };
}

export function localeCountryIso(): string | null {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || '';
    const parts = locale.split(/[-_]/);
    const iso = parts[parts.length - 1];
    if (iso && iso.length === 2) return iso.toUpperCase();
  } catch {
    return null;
  }
  return null;
}

export function isValidNationalNumber(country: CountryDial, local: string): boolean {
  const digits = digitsOnly(local);
  return digits.length >= country.min && digits.length <= country.max;
}
