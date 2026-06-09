import { Injectable } from '@nestjs/common';
import { WeatherService, WeatherData } from '../weather/weather.service';
import {
  DISASTER_THRESHOLDS,
  DisasterThresholdDef,
  WeatherInputs,
  RiskLevel,
  evaluateCondition,
  scoreToLevel,
} from './thresholds';
import { TIPS_DATA } from '../tips/tips.data';

export interface DisasterRisk {
  type: string;
  label: string;
  emoji: string;
  description: string;
  riskLevel: RiskLevel;
  riskScore: number;
  matchedConditions: string[];
  tips: {
    before: string[];
    during: string[];
    after: string[];
    emergency_contacts: string[];
  };
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

const RISK_ORDER: Record<RiskLevel, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MODERATE: 2,
  LOW: 1,
  NONE: 0,
};

@Injectable()
export class RiskService {
  constructor(private readonly weatherService: WeatherService) {}

  async assess(lat: number, lon: number): Promise<RiskAssessment> {
    const weather = await this.weatherService.getWeather(lat, lon);
    const inputs = this.toInputs(weather, lat);

    const risks: DisasterRisk[] = DISASTER_THRESHOLDS.map((def) =>
      this.scoreDisaster(def, inputs),
    ).sort((a, b) => RISK_ORDER[b.riskLevel] - RISK_ORDER[a.riskLevel]);

    const highestRisk = risks[0]?.riskLevel ?? 'NONE';

    return {
      location: {
        lat,
        lon,
        city: weather.city,
        country: weather.country,
      },
      weather,
      risks,
      highestRisk,
      timestamp: weather.timestamp,
    };
  }

  private toInputs(weather: WeatherData, lat: number): WeatherInputs {
    return {
      temp_f: weather.temp_f,
      humidity: weather.humidity,
      dewpoint_f: weather.dewpoint_f,
      wind_speed_mph: weather.wind_speed_mph,
      wind_gust_mph: weather.wind_gust_mph,
      rain_1h_in: weather.rain_1h_in,
      rain_3h_in: weather.rain_3h_in,
      rain_24h_in: weather.rain_24h_in,
      consecutive_dry_days: weather.consecutive_dry_days,
      lat,
    };
  }

  private scoreDisaster(def: DisasterThresholdDef, inputs: WeatherInputs): DisasterRisk {
    let score = 0;
    let maxScore = 0;
    const matched: string[] = [];

    for (const cond of def.conditions) {
      maxScore += cond.weight;
      if (evaluateCondition(inputs, cond)) {
        score += cond.weight;
        matched.push(cond.label);
      }
    }

    const riskLevel = scoreToLevel(score, maxScore);
    const riskScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const tips = TIPS_DATA[def.type] ?? {
      before: [],
      during: [],
      after: [],
      emergency_contacts: [],
    };

    return {
      type: def.type,
      label: def.label,
      emoji: def.emoji,
      description: def.description,
      riskLevel,
      riskScore,
      matchedConditions: matched,
      tips,
    };
  }
}
