import { Injectable, Logger } from '@nestjs/common';

export interface FemaDeclaration {
  disasterNumber: number;
  declarationTitle: string;
  disasterType: string;
  state: string;
  declarationDate: string;
  incidentBeginDate: string;
  incidentEndDate: string;
  designatedArea: string;
}

export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  lat: number;
  lon: number;
  depth_km: number;
  url: string;
}

export interface NwsAlert {
  id: string;
  event: string;
  severity: string;
  urgency: string;
  headline: string;
  description: string;
  onset: string;
  expires: string;
  areaDesc: string;
}

export interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
  state?: string;
  city?: string;
}

@Injectable()
export class DisastersService {
  private readonly logger = new Logger(DisastersService.name);

  async getFemaDeclarations(state?: string): Promise<FemaDeclaration[]> {
    try {
      const stateParam = state ? `&state=${state.toUpperCase()}` : '';
      const url = `https://www.fema.gov/api/open/v2/disasterDeclarations?$top=30&$orderby=declarationDate%20desc&$format=json${stateParam}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'DisasterWatchApp/1.0' },
      });
      const data = await res.json();
      return (data.DisasterDeclarations ?? []).map((d: any) => ({
        disasterNumber: d.disasterNumber,
        declarationTitle: d.declarationTitle,
        disasterType: d.incidentType,
        state: d.state,
        declarationDate: d.declarationDate,
        incidentBeginDate: d.incidentBeginDate,
        incidentEndDate: d.incidentEndDate,
        designatedArea: d.designatedArea,
      }));
    } catch (err) {
      this.logger.error('FEMA API error', err);
      return [];
    }
  }

  async getEarthquakes(lat?: number, lon?: number, radiusKm = 500): Promise<Earthquake[]> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      let url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=3.0&starttime=${thirtyDaysAgo}&limit=20&orderby=magnitude`;
      if (lat !== undefined && lon !== undefined) {
        url += `&latitude=${lat}&longitude=${lon}&maxradiuskm=${radiusKm}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      return (data.features ?? []).map((f: any) => ({
        id: f.id,
        magnitude: f.properties.mag,
        place: f.properties.place,
        time: f.properties.time,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
        depth_km: f.geometry.coordinates[2],
        url: f.properties.url,
      }));
    } catch (err) {
      this.logger.error('USGS API error', err);
      return [];
    }
  }

  async getNwsAlerts(lat: number, lon: number): Promise<NwsAlert[]> {
    try {
      const res = await fetch(
        `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`,
        { headers: { 'User-Agent': 'DisasterWatchApp/1.0 (contact@disasterwatch.app)' } },
      );
      const data = await res.json();
      return (data.features ?? []).map((f: any) => ({
        id: f.id,
        event: f.properties.event,
        severity: f.properties.severity,
        urgency: f.properties.urgency,
        headline: f.properties.headline,
        description: f.properties.description,
        onset: f.properties.onset,
        expires: f.properties.expires,
        areaDesc: f.properties.areaDesc,
      }));
    } catch (err) {
      this.logger.error('NWS Alerts API error', err);
      return [];
    }
  }

  async geocode(query: string): Promise<GeocodeResult[]> {
    try {
      const encoded = encodeURIComponent(query);
      const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&countrycodes=us&limit=5&addressdetails=1`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'DisasterWatchApp/1.0' },
      });
      const data = await res.json();
      return data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        display_name: item.display_name,
        state: item.address?.state,
        city: item.address?.city || item.address?.town || item.address?.village,
      }));
    } catch (err) {
      this.logger.error('Nominatim geocode error', err);
      return [];
    }
  }
}
