import {
  RiskAssessment,
  FemaDeclaration,
  Earthquake,
  NwsAlert,
  GeocodeResult,
} from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}`);
  }
  return res.json();
}

export const api = {
  risk: (lat: number, lon: number): Promise<RiskAssessment> =>
    get(`/risk?lat=${lat}&lon=${lon}`),

  femaDeclarations: (state?: string): Promise<FemaDeclaration[]> => {
    const q = state ? `?state=${state}` : '';
    return get(`/disasters/fema${q}`);
  },

  earthquakes: (lat?: number, lon?: number, radius = 500): Promise<Earthquake[]> => {
    if (lat !== undefined && lon !== undefined) {
      return get(`/disasters/earthquakes?lat=${lat}&lon=${lon}&radius=${radius}`);
    }
    return get('/disasters/earthquakes');
  },

  nwsAlerts: (lat: number, lon: number): Promise<NwsAlert[]> =>
    get(`/disasters/alerts?lat=${lat}&lon=${lon}`),

  geocode: (query: string): Promise<GeocodeResult[]> =>
    get(`/disasters/geocode?q=${encodeURIComponent(query)}`),
};
