export type RiskLevel = 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface WeatherData {
  temp_f: number;
  temp_c: number;
  feels_like_f: number;
  humidity: number;
  dewpoint_f: number;
  wind_speed_mph: number;
  wind_gust_mph: number;
  rain_1h_in: number;
  rain_3h_in: number;
  rain_24h_in: number;
  consecutive_dry_days: number;
  description: string;
  icon: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  timestamp: number;
  pressure_hpa?: number;
  visibility_miles?: number;
  clouds_pct?: number;
}

export interface DisasterTips {
  before: string[];
  during: string[];
  after: string[];
  emergency_contacts: string[];
}

export interface DisasterRisk {
  type: string;
  label: string;
  emoji: string;
  description: string;
  riskLevel: RiskLevel;
  riskScore: number;
  matchedConditions: string[];
  tips: DisasterTips;
}

export interface RiskAssessment {
  location: {
    lat: number;
    lon: number;
    city: string;
    country: string;
  };
  weather: WeatherData;
  risks: DisasterRisk[];
  highestRisk: RiskLevel;
  timestamp: number;
}

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

// Hex colors (used by Leaflet map markers)
export const RISK_COLORS: Record<RiskLevel, string> = {
  NONE:     '#6b7280',
  LOW:      '#22c55e',  // green
  MODERATE: '#eab308',  // yellow
  HIGH:     '#f97316',  // orange
  CRITICAL: '#ef4444',  // red
};

// Tailwind background classes
export const RISK_BG: Record<RiskLevel, string> = {
  NONE:     'bg-gray-600',
  LOW:      'bg-green-600',
  MODERATE: 'bg-yellow-500',
  HIGH:     'bg-orange-500',
  CRITICAL: 'bg-red-600',
};

// Tailwind text classes
export const RISK_TEXT: Record<RiskLevel, string> = {
  NONE:     'text-gray-300',
  LOW:      'text-green-300',
  MODERATE: 'text-yellow-300',
  HIGH:     'text-orange-300',
  CRITICAL: 'text-red-400',
};

// Tailwind border classes
export const RISK_BORDER: Record<RiskLevel, string> = {
  NONE:     'border-gray-600',
  LOW:      'border-green-500',
  MODERATE: 'border-yellow-500',
  HIGH:     'border-orange-500',
  CRITICAL: 'border-red-500',
};

// Card background tints per risk level
export const RISK_CARD_BG: Record<RiskLevel, string> = {
  NONE:     'bg-gray-800/30',
  LOW:      'bg-green-950/40',
  MODERATE: 'bg-yellow-950/40',
  HIGH:     'bg-orange-950/40',
  CRITICAL: 'bg-red-950/40',
};

// Glow CSS class per risk level
export const RISK_GLOW: Record<RiskLevel, string> = {
  NONE:     '',
  LOW:      'glow-green',
  MODERATE: 'glow-yellow',
  HIGH:     'glow-red',
  CRITICAL: 'glow-red',
};
