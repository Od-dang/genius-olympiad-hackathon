export type RiskLevel = 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface WeatherInputs {
  temp_f: number;
  humidity: number;
  dewpoint_f: number;
  wind_speed_mph: number;
  wind_gust_mph: number;
  rain_1h_in: number;
  rain_3h_in: number;
  rain_24h_in: number;
  consecutive_dry_days: number;
  lat: number;
}

export interface DisasterCondition {
  field: keyof WeatherInputs;
  op: 'gte' | 'lte';
  value: number;
  label: string;
  weight: number;
}

export interface DisasterThresholdDef {
  type: string;
  label: string;
  emoji: string;
  description: string;
  conditions: DisasterCondition[];
}

export const DISASTER_THRESHOLDS: DisasterThresholdDef[] = [
  {
    type: 'TORNADO',
    label: 'Tornado',
    emoji: '🌪️',
    description: 'Violent rotating column of air extending from a thunderstorm to the ground',
    conditions: [
      { field: 'temp_f', op: 'gte', value: 70, label: 'Surface temp ≥ 70°F', weight: 1 },
      { field: 'dewpoint_f', op: 'gte', value: 65, label: 'Dewpoint ≥ 65°F (moisture-rich air)', weight: 3 },
      { field: 'humidity', op: 'gte', value: 60, label: 'Humidity ≥ 60%', weight: 1 },
      { field: 'wind_speed_mph', op: 'gte', value: 20, label: 'Strong winds ≥ 20 mph', weight: 1 },
    ],
  },
  {
    type: 'HURRICANE',
    label: 'Hurricane',
    emoji: '🌀',
    description: 'Tropical cyclone with sustained winds ≥ 74 mph, forming over warm ocean waters',
    conditions: [
      { field: 'temp_f', op: 'gte', value: 79, label: 'Air temp ≥ 79°F (warm ocean proxy)', weight: 2 },
      { field: 'humidity', op: 'gte', value: 80, label: 'Humidity 80–90%+', weight: 2 },
      { field: 'wind_speed_mph', op: 'gte', value: 25, label: 'Wind speed ≥ 25 mph', weight: 2 },
      { field: 'rain_24h_in', op: 'gte', value: 3, label: 'Heavy rain forecast ≥ 3 in/24h', weight: 1 },
    ],
  },
  {
    type: 'FLOOD',
    label: 'Flood',
    emoji: '🌊',
    description: 'Overflow of water submerging normally dry land due to excessive rainfall',
    conditions: [
      { field: 'humidity', op: 'gte', value: 90, label: 'Near-saturated air (humidity ≥ 90%)', weight: 1 },
      { field: 'rain_1h_in', op: 'gte', value: 0.5, label: 'Significant rain ≥ 0.5 in/hour', weight: 2 },
      { field: 'rain_1h_in', op: 'gte', value: 2.0, label: 'Flash flood rain ≥ 2 in/hour', weight: 4 },
      { field: 'rain_24h_in', op: 'gte', value: 4.0, label: 'Sustained rain ≥ 4 in/24h forecast', weight: 1 },
    ],
  },
  {
    type: 'WILDFIRE',
    label: 'Wildfire',
    emoji: '🔥',
    description: 'Uncontrolled fire spreading through vegetated areas fueled by heat and dry conditions',
    conditions: [
      { field: 'temp_f', op: 'gte', value: 90, label: 'Extreme heat ≥ 90°F', weight: 2 },
      { field: 'humidity', op: 'lte', value: 25, label: 'Critically low humidity ≤ 25%', weight: 3 },
      { field: 'consecutive_dry_days', op: 'gte', value: 14, label: '14+ consecutive dry days', weight: 2 },
      { field: 'wind_speed_mph', op: 'gte', value: 15, label: 'Wind ≥ 15 mph (spreads fire rapidly)', weight: 1 },
    ],
  },
  {
    type: 'DROUGHT',
    label: 'Drought',
    emoji: '☀️',
    description: 'Extended period of below-average precipitation causing water shortage',
    conditions: [
      { field: 'humidity', op: 'lte', value: 30, label: 'Persistently low humidity ≤ 30%', weight: 2 },
      { field: 'consecutive_dry_days', op: 'gte', value: 14, label: '2+ weeks without meaningful rain', weight: 3 },
      { field: 'temp_f', op: 'gte', value: 95, label: 'Temp ≥ 95°F (10°F+ above normal)', weight: 2 },
    ],
  },
  {
    type: 'LANDSLIDE',
    label: 'Landslide',
    emoji: '⛰️',
    description: 'Mass movement of rock, earth, or debris down a slope triggered by heavy rain',
    conditions: [
      { field: 'rain_24h_in', op: 'gte', value: 4.0, label: 'Heavy rain ≥ 4 in/24 hours', weight: 3 },
      { field: 'humidity', op: 'gte', value: 90, label: 'Near-saturated soil conditions', weight: 2 },
      { field: 'rain_1h_in', op: 'gte', value: 1.0, label: 'Intense rain ≥ 1 in/hour', weight: 2 },
    ],
  },
  {
    type: 'BLIZZARD',
    label: 'Blizzard',
    emoji: '❄️',
    description: 'Severe snowstorm with strong winds (35+ mph), heavy snow, and near-zero visibility',
    conditions: [
      { field: 'temp_f', op: 'lte', value: 32, label: 'Freezing temps ≤ 32°F', weight: 3 },
      { field: 'humidity', op: 'gte', value: 60, label: 'Adequate moisture ≥ 60%', weight: 1 },
      { field: 'wind_speed_mph', op: 'gte', value: 35, label: 'Blizzard-force winds ≥ 35 mph', weight: 2 },
      { field: 'rain_1h_in', op: 'gte', value: 0.05, label: 'Active precipitation', weight: 2 },
    ],
  },
];

export function evaluateCondition(inputs: WeatherInputs, cond: DisasterCondition): boolean {
  const val = inputs[cond.field] as number;
  if (cond.op === 'gte') return val >= cond.value;
  if (cond.op === 'lte') return val <= cond.value;
  return false;
}

export function scoreToLevel(score: number, maxScore: number): RiskLevel {
  if (maxScore === 0) return 'NONE';
  const pct = (score / maxScore) * 100;
  if (pct >= 76) return 'CRITICAL';
  if (pct >= 56) return 'HIGH';
  if (pct >= 36) return 'MODERATE';
  if (pct >= 16) return 'LOW';
  return 'NONE';
}
