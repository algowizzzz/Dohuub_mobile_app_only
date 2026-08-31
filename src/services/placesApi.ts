import { ENV } from '../config/env';

const BASE = 'https://maps.googleapis.com/maps/api';

export type PlaceSuggestion = {
  placeId: string;
  primary: string;
  secondary: string;
  description: string;
};

export type ResolvedAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  formatted: string;
};

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GeocodeResult = {
  place_id?: string;
  formatted_address?: string;
  address_components?: AddressComponent[];
  geometry?: { location?: { lat: number; lng: number } };
};

type PlacesStatus = { status?: string; error_message?: string };

let placesAutocompleteEnabled: boolean | null = null;

function apiKey(): string {
  return ENV.googleMapsApiKey;
}

export function createPlacesSessionToken(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function pick(components: AddressComponent[], type: string, short = false): string {
  const match = components.find(item => item.types.includes(type));
  if (!match) return '';
  return short ? match.short_name : match.long_name;
}

export function parseGoogleAddress(
  components: AddressComponent[] = [],
  geometry?: { location?: { lat: number; lng: number } },
  formattedAddress = '',
): ResolvedAddress | null {
  const latitude = geometry?.location?.lat;
  const longitude = geometry?.location?.lng;
  if (latitude == null || longitude == null) return null;

  const streetNumber = pick(components, 'street_number');
  const route = pick(components, 'route');
  const premise = pick(components, 'premise');
  const neighborhood = pick(components, 'neighborhood');
  const street =
    [streetNumber, route].filter(Boolean).join(' ') ||
    premise ||
    neighborhood ||
    formattedAddress.split(',')[0]?.trim() ||
    formattedAddress;

  const city =
    pick(components, 'locality') ||
    pick(components, 'postal_town') ||
    pick(components, 'sublocality_level_1') ||
    pick(components, 'sublocality') ||
    pick(components, 'administrative_area_level_2') ||
    formattedAddress
      .split(',')
      .map(part => part.trim())
      .filter(Boolean)[1] ||
    '';

  const state =
    pick(components, 'administrative_area_level_1', true) ||
    pick(components, 'administrative_area_level_1');
  const zip = pick(components, 'postal_code');

  return {
    street,
    city,
    state,
    zip,
    latitude,
    longitude,
    formatted: formattedAddress || street,
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return (await response.json()) as T;
}

function fromGeocodeResults(results: GeocodeResult[] | undefined): PlaceSuggestion[] {
  return (results ?? []).slice(0, 6).map(result => {
    const formatted = result.formatted_address || '';
    const [primary, ...rest] = formatted.split(',');
    return {
      placeId: result.place_id || formatted,
      primary: primary?.trim() || formatted,
      secondary: rest.join(',').trim(),
      description: formatted,
    };
  });
}

async function geocodeSuggestions(query: string): Promise<PlaceSuggestion[]> {
  if (!apiKey()) return [];
  const params = new URLSearchParams({ address: query, key: apiKey() });
  const json = await fetchJson<PlacesStatus & { results?: GeocodeResult[] }>(`${BASE}/geocode/json?${params}`);
  if (json.status !== 'OK') return [];
  return fromGeocodeResults(json.results);
}

export async function autocompletePlaces(query: string, sessionToken: string): Promise<PlaceSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2 || !apiKey()) return [];

  if (placesAutocompleteEnabled === false) {
    return geocodeSuggestions(trimmed);
  }

  const params = new URLSearchParams({
    input: trimmed,
    key: apiKey(),
    sessiontoken: sessionToken,
    language: 'en',
  });
  const json = await fetchJson<
    PlacesStatus & {
      predictions?: Array<{
        place_id: string;
        description: string;
        structured_formatting?: { main_text?: string; secondary_text?: string };
      }>;
    }
  >(`${BASE}/place/autocomplete/json?${params}`);

  if (json.status === 'OK' || json.status === 'ZERO_RESULTS') {
    placesAutocompleteEnabled = true;
    return (json.predictions ?? []).slice(0, 6).map(item => ({
      placeId: item.place_id,
      primary: item.structured_formatting?.main_text || item.description,
      secondary: item.structured_formatting?.secondary_text || '',
      description: item.description,
    }));
  }

  if (json.status === 'REQUEST_DENIED') {
    placesAutocompleteEnabled = false;
  }

  return geocodeSuggestions(trimmed);
}

export async function resolvePlace(placeId: string, sessionToken?: string): Promise<ResolvedAddress | null> {
  if (!apiKey() || !placeId) return null;

  const detailsParams = new URLSearchParams({
    place_id: placeId,
    key: apiKey(),
    fields: 'address_component,formatted_address,geometry',
  });
  if (sessionToken) detailsParams.set('sessiontoken', sessionToken);

  try {
    const details = await fetchJson<PlacesStatus & { result?: GeocodeResult }>(
      `${BASE}/place/details/json?${detailsParams}`,
    );
    if (details.status === 'OK' && details.result) {
      return parseGoogleAddress(
        details.result.address_components,
        details.result.geometry,
        details.result.formatted_address,
      );
    }
  } catch {
    // Fall through to Geocoding, which is already enabled for this key.
  }

  const geoParams = new URLSearchParams({ place_id: placeId, key: apiKey() });
  const geo = await fetchJson<PlacesStatus & { results?: GeocodeResult[] }>(`${BASE}/geocode/json?${geoParams}`);
  const result = geo.results?.[0];
  if (!result) return null;
  return parseGoogleAddress(result.address_components, result.geometry, result.formatted_address);
}

export async function reverseGeocode(lat: number, lng: number): Promise<ResolvedAddress | null> {
  if (!apiKey() || Number.isNaN(lat) || Number.isNaN(lng)) return null;
  const params = new URLSearchParams({
    latlng: `${lat},${lng}`,
    key: apiKey(),
  });
  const json = await fetchJson<PlacesStatus & { results?: GeocodeResult[] }>(`${BASE}/geocode/json?${params}`);
  const result = json.results?.[0];
  if (!result) return null;
  return parseGoogleAddress(result.address_components, result.geometry, result.formatted_address);
}

export function staticMapUrl(lat: number, lng: number, width = 640, height = 280): string {
  const params = new URLSearchParams({
    center: `${lat},${lng}`,
    zoom: '16',
    size: `${width}x${height}`,
    scale: '2',
    maptype: 'roadmap',
    markers: `color:0x2E7AD9|${lat},${lng}`,
    key: apiKey(),
  });
  return `${BASE}/staticmap?${params}`;
}
