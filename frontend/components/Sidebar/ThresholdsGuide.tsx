import { useState } from 'react';

const FIELD_LABELS: Record<string, string> = {
  temp_f: 'Temperature',
  humidity: 'Humidity',
  dewpoint_f: 'Dewpoint',
  wind_speed_mph: 'Wind Speed',
  wind_gust_mph: 'Wind Gusts',
  rain_1h_in: 'Rainfall (1 hr)',
  rain_3h_in: 'Rainfall (3 hr)',
  rain_24h_in: 'Rainfall (24 hr)',
  consecutive_dry_days: 'Dry Days',
};

const FIELD_UNITS: Record<string, string> = {
  temp_f: '°F',
  humidity: '%',
  dewpoint_f: '°F',
  wind_speed_mph: 'mph',
  wind_gust_mph: 'mph',
  rain_1h_in: 'in',
  rain_3h_in: 'in',
  rain_24h_in: 'in',
  consecutive_dry_days: 'days',
};

interface Condition {
  field: string;
  op: 'gte' | 'lte';
  value: number;
  label: string;
  weight: number;
}

interface DisasterDef {
  type: string;
  label: string;
  emoji: string;
  description: string;
  conditions: Condition[];
}

const DISASTERS: DisasterDef[] = [
  {
    type: 'TORNADO', label: 'Tornado', emoji: '🌪️',
    description: 'Violent rotating column of air extending from a thunderstorm to the ground',
    conditions: [
      { field: 'temp_f',         op: 'gte', value: 70,   label: 'Surface temp ≥ 70°F',             weight: 1 },
      { field: 'dewpoint_f',     op: 'gte', value: 65,   label: 'Dewpoint ≥ 65°F (moisture-rich)', weight: 3 },
      { field: 'humidity',       op: 'gte', value: 60,   label: 'Humidity ≥ 60%',                  weight: 1 },
      { field: 'wind_speed_mph', op: 'gte', value: 20,   label: 'Strong winds ≥ 20 mph',           weight: 1 },
    ],
  },
  {
    type: 'HURRICANE', label: 'Hurricane', emoji: '🌀',
    description: 'Tropical cyclone with sustained winds ≥ 74 mph forming over warm ocean waters',
    conditions: [
      { field: 'temp_f',         op: 'gte', value: 79,   label: 'Air temp ≥ 79°F',           weight: 2 },
      { field: 'humidity',       op: 'gte', value: 80,   label: 'Humidity ≥ 80%',             weight: 2 },
      { field: 'wind_speed_mph', op: 'gte', value: 25,   label: 'Wind speed ≥ 25 mph',        weight: 2 },
      { field: 'rain_24h_in',    op: 'gte', value: 3,    label: 'Rain forecast ≥ 3 in/24 hr', weight: 1 },
    ],
  },
  {
    type: 'FLOOD', label: 'Flood', emoji: '🌊',
    description: 'Overflow of water submerging normally dry land due to excessive rainfall',
    conditions: [
      { field: 'humidity',    op: 'gte', value: 90,  label: 'Humidity ≥ 90% (saturated air)',      weight: 1 },
      { field: 'rain_1h_in', op: 'gte', value: 0.5, label: 'Significant rain ≥ 0.5 in/hr',        weight: 2 },
      { field: 'rain_1h_in', op: 'gte', value: 2.0, label: 'Flash flood rain ≥ 2 in/hr',          weight: 4 },
      { field: 'rain_24h_in',op: 'gte', value: 4.0, label: 'Sustained rain ≥ 4 in/24 hr forecast',weight: 1 },
    ],
  },
  {
    type: 'WILDFIRE', label: 'Wildfire', emoji: '🔥',
    description: 'Uncontrolled fire spreading through vegetation fueled by heat and dry conditions',
    conditions: [
      { field: 'temp_f',               op: 'gte', value: 90,  label: 'Extreme heat ≥ 90°F',              weight: 2 },
      { field: 'humidity',             op: 'lte', value: 25,  label: 'Critically low humidity ≤ 25%',    weight: 3 },
      { field: 'consecutive_dry_days', op: 'gte', value: 14,  label: '14+ consecutive dry days',         weight: 2 },
      { field: 'wind_speed_mph',       op: 'gte', value: 15,  label: 'Wind ≥ 15 mph (spreads fire)',     weight: 1 },
    ],
  },
  {
    type: 'DROUGHT', label: 'Drought', emoji: '☀️',
    description: 'Extended period of below-average precipitation causing water shortage',
    conditions: [
      { field: 'humidity',             op: 'lte', value: 30,  label: 'Low humidity ≤ 30%',               weight: 2 },
      { field: 'consecutive_dry_days', op: 'gte', value: 14,  label: '2+ weeks without meaningful rain', weight: 3 },
      { field: 'temp_f',               op: 'gte', value: 95,  label: 'Temp ≥ 95°F (above normal)',       weight: 2 },
    ],
  },
  {
    type: 'LANDSLIDE', label: 'Landslide', emoji: '⛰️',
    description: 'Mass movement of rock, earth, or debris down a slope triggered by heavy rain',
    conditions: [
      { field: 'rain_24h_in', op: 'gte', value: 4.0, label: 'Heavy rain ≥ 4 in/24 hours',       weight: 3 },
      { field: 'humidity',    op: 'gte', value: 90,  label: 'Near-saturated soil (humidity ≥ 90%)', weight: 2 },
      { field: 'rain_1h_in',  op: 'gte', value: 1.0, label: 'Intense rain ≥ 1 in/hr',            weight: 2 },
    ],
  },
  {
    type: 'BLIZZARD', label: 'Blizzard', emoji: '❄️',
    description: 'Severe snowstorm with strong winds, heavy snow, and near-zero visibility',
    conditions: [
      { field: 'temp_f',         op: 'lte', value: 32,   label: 'Freezing temps ≤ 32°F',      weight: 3 },
      { field: 'humidity',       op: 'gte', value: 60,   label: 'Adequate moisture ≥ 60%',     weight: 1 },
      { field: 'wind_speed_mph', op: 'gte', value: 35,   label: 'Blizzard-force winds ≥ 35 mph', weight: 2 },
      { field: 'rain_1h_in',     op: 'gte', value: 0.05, label: 'Active precipitation',        weight: 2 },
    ],
  },
];

const RISK_LEVELS = [
  { label: 'LOW',      pct: '16–35%', color: 'text-green-400',  bg: 'bg-green-900/40',  border: 'border-green-700' },
  { label: 'MODERATE', pct: '36–55%', color: 'text-yellow-400', bg: 'bg-yellow-900/40', border: 'border-yellow-700' },
  { label: 'HIGH',     pct: '56–75%', color: 'text-orange-400', bg: 'bg-orange-900/40', border: 'border-orange-700' },
  { label: 'CRITICAL', pct: '76–100%',color: 'text-red-400',    bg: 'bg-red-900/40',    border: 'border-red-700' },
];

function WeightDots({ weight, max }: { weight: number; max: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < weight ? 'bg-blue-400' : 'bg-blue-900'}`}
        />
      ))}
    </div>
  );
}

function DisasterCard({ disaster }: { disaster: DisasterDef }) {
  const [open, setOpen] = useState(false);
  const maxWeight = Math.max(...disaster.conditions.map((c) => c.weight));
  const totalWeight = disaster.conditions.reduce((s, c) => s + c.weight, 0);

  return (
    <div className="rounded-xl border border-blue-800/60 overflow-hidden" style={{ background: '#071525' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-900/20 transition-colors text-left"
      >
        <span className="text-2xl shrink-0">{disaster.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm">{disaster.label}</div>
          <div className="text-xs text-blue-400 truncate">{disaster.conditions.length} trigger conditions</div>
        </div>
        <span className="text-blue-600 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-blue-900/60 px-4 py-3 space-y-3">
          <p className="text-xs text-blue-300 leading-relaxed">{disaster.description}</p>

          <div>
            <div className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-2">
              Trigger Conditions
            </div>
            <div className="space-y-2">
              {disaster.conditions.map((c, i) => (
                <div key={i} className="rounded-lg px-3 py-2 border border-blue-800/40" style={{ background: '#0a1e35' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-blue-200 font-medium">{c.label}</div>
                      <div className="text-xs text-blue-500 mt-0.5">
                        {FIELD_LABELS[c.field]} {c.op === 'gte' ? '≥' : '≤'} {c.value}{FIELD_UNITS[c.field]}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs text-blue-500">weight</span>
                      <WeightDots weight={c.weight} max={maxWeight} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg px-3 py-2 border border-blue-800/40 text-xs text-blue-400" style={{ background: '#0a1e35' }}>
            Risk score = sum of matched condition weights ÷ {totalWeight} total weight × 100%
          </div>
        </div>
      )}
    </div>
  );
}

export default function ThresholdsGuide() {
  return (
    <div className="p-4 space-y-4">

      {/* Scoring explanation */}
      <div className="rounded-xl p-4 border border-blue-800/60 space-y-3" style={{ background: '#071525' }}>
        <div className="text-sm font-bold text-blue-100">How Risk is Scored</div>
        <p className="text-xs text-blue-300 leading-relaxed">
          Each disaster has a set of weather conditions with different weights. When current conditions match a trigger,
          its weight is added to the score. The final percentage determines the risk level.
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {RISK_LEVELS.map((r) => (
            <div key={r.label} className={`rounded-lg px-3 py-2 border ${r.border} ${r.bg} flex items-center justify-between`}>
              <span className={`text-xs font-bold ${r.color}`}>{r.label}</span>
              <span className="text-xs text-blue-400">{r.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disaster cards */}
      <div className="space-y-2">
        <div className="text-xs text-blue-500 uppercase tracking-widest font-semibold">
          Disaster Conditions
        </div>
        {DISASTERS.map((d) => (
          <DisasterCard key={d.type} disaster={d} />
        ))}
      </div>
    </div>
  );
}
