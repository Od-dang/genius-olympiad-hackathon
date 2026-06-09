import { WeatherData } from '@/types';

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
  const iconUrl = weather.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : null;

  const rainAccent = weather.rain_1h_in >= 2 ? 'red' : weather.rain_1h_in >= 0.5 ? 'yellow' : 'blue';
  const humidAccent = weather.humidity >= 90 ? 'red' : weather.humidity >= 70 ? 'yellow' : 'blue';
  const tempAccent  = weather.temp_f >= 95 ? 'red' : weather.temp_f <= 32 ? 'blue' : weather.temp_f >= 85 ? 'yellow' : 'green';

  return (
    <div className="p-4 space-y-4">

      {/* Hero: temperature + icon */}
      <div
        className="rounded-xl p-4 flex items-center gap-4 border border-blue-800/50"
        style={{ background: 'linear-gradient(135deg, #0f2a4a 0%, #0a1e35 100%)' }}
      >
        {iconUrl && <img src={iconUrl} alt={weather.description} className="w-16 h-16" />}
        <div>
          <div className="text-5xl font-extrabold text-white">
            {Math.round(weather.temp_f)}°F
          </div>
          <div className="text-blue-200 capitalize mt-0.5">{weather.description}</div>
          <div className="text-blue-400 text-sm">
            Feels like {Math.round(weather.feels_like_f)}°F
            &nbsp;·&nbsp;{Math.round(weather.temp_c)}°C
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <Stat
          label="Humidity"
          value={`${weather.humidity}%`}
          accent={humidAccent as any}
        />
        <Stat
          label="Dewpoint"
          value={`${Math.round(weather.dewpoint_f)}°F`}
          sub={`${Math.round((weather.dewpoint_f - 32) * 5 / 9)}°C`}
          accent={weather.dewpoint_f >= 65 ? 'yellow' : 'blue'}
        />
        <Stat
          label="Wind Speed"
          value={`${Math.round(weather.wind_speed_mph)} mph`}
          sub={weather.wind_gust_mph > 0 ? `Gusts ${Math.round(weather.wind_gust_mph)} mph` : undefined}
          accent={weather.wind_speed_mph >= 35 ? 'red' : weather.wind_speed_mph >= 20 ? 'yellow' : 'blue'}
        />
        <Stat
          label="Rainfall (1h)"
          value={`${weather.rain_1h_in.toFixed(2)} in`}
          sub={`24h forecast: ${weather.rain_24h_in.toFixed(2)} in`}
          accent={rainAccent as any}
        />
        {weather.pressure_hpa !== undefined && (
          <Stat label="Pressure" value={`${weather.pressure_hpa} hPa`} />
        )}
        {weather.visibility_miles !== undefined && (
          <Stat label="Visibility" value={`${weather.visibility_miles.toFixed(1)} mi`} />
        )}
        {weather.clouds_pct !== undefined && (
          <Stat label="Cloud Cover" value={`${weather.clouds_pct}%`} />
        )}
        <Stat
          label="Dry Days"
          value={`${weather.consecutive_dry_days}`}
          sub="consecutive days without rain"
          accent={weather.consecutive_dry_days >= 14 ? 'red' : weather.consecutive_dry_days >= 7 ? 'yellow' : 'green'}
        />
        <Stat
          label="Temperature"
          value={`${Math.round(weather.temp_f)}°F`}
          sub={`${Math.round(weather.temp_c)}°C`}
          accent={tempAccent as any}
        />
      </div>

      <div className="text-xs text-blue-700 text-center">
        Updated {new Date(weather.timestamp * 1000).toLocaleTimeString()}
      </div>
    </div>
  );
}
