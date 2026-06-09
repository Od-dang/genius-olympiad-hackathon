import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
  uv_index?: number;
  pressure_hpa?: number;
  visibility_miles?: number;
  clouds_pct?: number;
}

// OWM rain amounts are in mm regardless of units param
const MM_TO_IN = 0.0393701;

@Injectable()
export class WeatherService {
  constructor(private config: ConfigService) {}

  async getWeather(lat: number, lon: number): Promise<WeatherData> {
    const key = this.config.get<string>('OPENWEATHERMAP_API_KEY');
    if (!key) throw new InternalServerErrorException('OPENWEATHERMAP_API_KEY is not configured');

    const [current, forecast] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`,
      ).then((r) => r.json()),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`,
      ).then((r) => r.json()),
    ]);

    if (current.cod && current.cod !== 200 && current.cod !== '200') {
      throw new InternalServerErrorException(`OpenWeatherMap error: ${current.message}`);
    }

    return this.normalize(current, forecast, lat, lon);
  }

  normalize(current: any, forecast: any, lat: number, lon: number): WeatherData {
    const temp_f: number = current.main?.temp ?? 0;
    const temp_c: number = (temp_f - 32) * (5 / 9);
    const humidity: number = current.main?.humidity ?? 0;

    // Magnus formula dewpoint approximation
    const dewpoint_c = temp_c - (100 - humidity) / 5;
    const dewpoint_f = dewpoint_c * (9 / 5) + 32;

    const rain_1h_in = (current.rain?.['1h'] ?? 0) * MM_TO_IN;
    const rain_3h_in = (current.rain?.['3h'] ?? 0) * MM_TO_IN;

    // Sum rain from next 8 forecast periods (24 hours)
    const forecastList: any[] = forecast.list ?? [];
    const next8 = forecastList.slice(0, 8);
    const rain_24h_in = next8.reduce(
      (sum: number, item: any) => sum + (item.rain?.['3h'] ?? 0) * MM_TO_IN,
      0,
    );

    const consecutive_dry_days = this.estimateDryDays(humidity, rain_1h_in, forecastList);

    return {
      temp_f,
      temp_c,
      feels_like_f: current.main?.feels_like ?? temp_f,
      humidity,
      dewpoint_f,
      wind_speed_mph: current.wind?.speed ?? 0,
      wind_gust_mph: current.wind?.gust ?? 0,
      rain_1h_in,
      rain_3h_in,
      rain_24h_in,
      consecutive_dry_days,
      description: current.weather?.[0]?.description ?? '',
      icon: current.weather?.[0]?.icon ?? '01d',
      city: current.name ?? '',
      country: current.sys?.country ?? '',
      lat,
      lon,
      timestamp: current.dt ?? Math.floor(Date.now() / 1000),
      pressure_hpa: current.main?.pressure,
      visibility_miles: current.visibility ? current.visibility * 0.000621371 : undefined,
      clouds_pct: current.clouds?.all,
    };
  }

  private estimateDryDays(humidity: number, rain_1h_in: number, forecastList: any[]): number {
    // Count consecutive dry 3h periods going forward
    let dryPeriods = 0;
    for (const item of forecastList) {
      if ((item.rain?.['3h'] ?? 0) * MM_TO_IN < 0.01) {
        dryPeriods++;
      } else {
        break;
      }
    }

    // Base estimate from dry forecast periods (3h each)
    let estimate = Math.floor((dryPeriods * 3) / 24);

    // Boost estimate if current conditions indicate prolonged dryness
    if (rain_1h_in < 0.01) {
      if (humidity < 20) estimate = Math.max(estimate, 21);
      else if (humidity < 30) estimate = Math.max(estimate, 14);
      else if (humidity < 40) estimate = Math.max(estimate, 7);
      else if (humidity < 50) estimate = Math.max(estimate, 3);
    }

    return estimate;
  }
}
