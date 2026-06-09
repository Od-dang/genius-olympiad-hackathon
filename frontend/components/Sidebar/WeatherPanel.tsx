import { WeatherData } from '@/types';

// Map OWM icon prefix to a short weather label (displayed instead of the icon image)
const WEATHER_LABELS: Record<string, string> = {
  '01': 'CLEAR',
  '02': 'PARTLY CLOUDY',
  '03': 'CLOUDY',
  '04': 'OVERCAST',
  '09': 'SHOWERS',
  '10': 'RAIN',
  '11': 'STORM',
  '13': 'SNOW',
  '50': 'FOG',
};

function getWeatherLabel(icon: string, description: string): string {
  const prefix = icon?.slice(0, 2);
  return WEATHER_LABELS[prefix] ?? description.toUpperCase();
}

interface Props {
  weather: WeatherData;
}

function Stat({ label, value, sub, accent }: {
  label: string;
  value: string;
  sub?: string;
  accent?: 'blue' | 'green' | 'yellow' | 'red';
}) {
  const valueColor = {
    blue:   'text-blue-300',
    green:  'text-green-400',
    yellow: 'text-yellow-400',
    red:    'text-red-400',
  }[accent ?? 'blue'];

  return (
    <div className="rounded-xl p-3 border border-blue-800/60" style={{ background: '#0a1e35' }}>
      <div className="text-xs text-blue-500 mb-1 uppercase tracking-wide">{label}</div>
      <div className={`text-xl font-bold ${valueColor}`}>{value}</div>
      {sub && <div className="text-xs text-blue-600 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function WeatherPanel({ weather }: Props) {
  const weatherLabel = getWeatherLabel(weather.icon, weather.description);
  const rainAccent   = weather.rain_1h_in >= 2 ? 'red' : weather.rain_1h_in >= 0.5 ? 'yellow' : 'blue';
  const humidAccent  = weather.humidity >= 90 ? 'red' : weather.humidity >= 70 ? 'yellow' : 'blue';
  const tempAccent   = weather.temp_f >= 95 ? 'red' : weather.temp_f <= 32 ? 'blue' : weather.temp_f >= 85 ? 'yellow' : 'green';

  return (
    <div className="p-4 space-y-4">

      {/* ── Hero card: condition label + temperature ── */}
      <div
        className="rounded-xl p-5 border border-blue-800/50 flex items-center gap-5"
        style={{ background: 'linear-gradient(135deg, #0f2a4a 0%, #0a1e35 100%)' }}
      >
        {/* Weather condition text label (replaces icon image) */}
        <div
          className="shrink-0 flex items-center justify-center rounded-xl border border-blue-600/50 px-3 py-2"
          style={{ background: '#071525', minWidth: '90px', minHeight: '64px' }}
        >
          <span
            className="text-xs font-extrabold tracking-widest text-blue-300 uppercase text-center leading-snug"
            style={{ fontFamily: "'TT Lakes Neue', sans-serif", wordBreak: 'break-word' }}
          >
            {weatherLabel}
          </span>
        </div>

        {/* Temperature + description */}
        <div>
          <div
            className="text-5xl font-extrabold text-white leading-none"
            style={{ fontFamily: "'TT Lakes Neue', sans-serif" }}
          >
            {Math.round(weather.temp_f)}°F
          </div>
          <div
            className="text-blue-200 capitalize mt-1"
            style={{ fontFamily: "'TT Lakes Neue', sans-serif" }}
          >
            {weather.description}
          </div>
          <div className="text-blue-400 text-sm mt-0.5">
            Feels like {Math.round(weather.feels_like_f)}°F
            &nbsp;·&nbsp;{Math.round(weather.temp_c)}°C
          </div>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Humidity"    value={`${weather.humidity}%`}                     accent={humidAccent as any} />
        <Stat label="Dewpoint"    value={`${Math.round(weather.dewpoint_f)}°F`}       sub={`${Math.round((weather.dewpoint_f - 32) * 5 / 9)}°C`} accent={weather.dewpoint_f >= 65 ? 'yellow' : 'blue'} />
        <Stat label="Wind Speed"  value={`${Math.round(weather.wind_speed_mph)} mph`} sub={weather.wind_gust_mph > 0 ? `Gusts ${Math.round(weather.wind_gust_mph)} mph` : undefined} accent={weather.wind_speed_mph >= 35 ? 'red' : weather.wind_speed_mph >= 20 ? 'yellow' : 'blue'} />
        <Stat label="Rainfall 1h" value={`${weather.rain_1h_in.toFixed(2)} in`}       sub={`24h forecast: ${weather.rain_24h_in.toFixed(2)} in`} accent={rainAccent as any} />
        {weather.pressure_hpa    !== undefined && <Stat label="Pressure"   value={`${weather.pressure_hpa} hPa`} />}
        {weather.visibility_miles !== undefined && <Stat label="Visibility" value={`${weather.visibility_miles.toFixed(1)} mi`} />}
        {weather.clouds_pct       !== undefined && <Stat label="Cloud Cover" value={`${weather.clouds_pct}%`} />}
        <Stat
          label="Dry Days"
          value={`${weather.consecutive_dry_days}`}
          sub="consecutive days without rain"
          accent={weather.consecutive_dry_days >= 14 ? 'red' : weather.consecutive_dry_days >= 7 ? 'yellow' : 'green'}
        />
      </div>

      <div className="text-xs text-blue-700 text-center">
        Updated {new Date(weather.timestamp * 1000).toLocaleTimeString()}
      </div>
    </div>
  );
}
