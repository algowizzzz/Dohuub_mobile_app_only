import { ENV } from '../config/env';
import { countryFromIso } from '../constants/countries';

export async function countryIsoFromCoords(lat: number, lng: number): Promise<string | null> {
  if (!ENV.googleMapsApiKey) return null;
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=country&key=${ENV.googleMapsApiKey}`;
    const res = await fetch(url);
    const json = (await res.json()) as {
      results?: Array<{ address_components?: Array<{ short_name: string; types: string[] }> }>;
    };
    const component = json.results?.[0]?.address_components?.find(c => c.types.includes('country'));
    const iso = component?.short_name;
    return iso && countryFromIso(iso).iso === iso.toUpperCase() ? iso.toUpperCase() : iso?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}
