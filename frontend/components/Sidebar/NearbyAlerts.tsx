'use client';

import { useState, useEffect } from 'react';
import { NwsAlert, Earthquake } from '@/types';
import { api } from '@/lib/api';

interface Props {
  lat: number;
  lon: number;
}

const SEVERITY_STYLE: Record<string, string> = {
  Extreme: 'border-red-500    bg-red-950/50    text-red-300',
  Severe:  'border-orange-500 bg-orange-950/50 text-orange-300',
  Moderate:'border-yellow-500 bg-yellow-950/40 text-yellow-300',
  Minor:   'border-blue-600   bg-blue-950/40   text-blue-300',
};

export default function NearbyAlerts({ lat, lon }: Props) {
  const [alerts, setAlerts]   = useState<NwsAlert[]>([]);
  const [quakes, setQuakes]   = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.nwsAlerts(lat, lon).catch(() => [] as NwsAlert[]),
      api.earthquakes(lat, lon, 800).catch(() => [] as Earthquake[]),
    ]).then(([a, q]) => {
      setAlerts(a);
      setQuakes(q.slice(0, 10));
      setLoading(false);
    });
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 gap-3 text-blue-400 text-sm">
        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        Loading alerts...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5">

      {/* NWS Weather Alerts */}
      <section>
        <h3 className="text-xs text-blue-500 uppercase tracking-widest font-semibold mb-2">
          Active NWS Alerts ({alerts.length})
        </h3>
        {alerts.length === 0 ? (
          <div className="flex items-center gap-3 bg-green-950/40 border border-green-700 rounded-xl p-3">
            <span className="text-xl">✅</span>
            <p className="text-sm text-green-300">No active weather alerts for this area</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((a) => {
              const style = SEVERITY_STYLE[a.severity] || SEVERITY_STYLE.Minor;
              const isOpen = expandedAlert === a.id;
              return (
                <div key={a.id} className={`rounded-xl border ${style} overflow-hidden`}>
                  <button
                    onClick={() => setExpandedAlert(isOpen ? null : a.id)}
                    className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm">{a.event}</div>
                        <div className="text-xs opacity-70 mt-0.5">{a.areaDesc}</div>
                      </div>
                      <span className="text-xs opacity-50 shrink-0 mt-0.5">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 pt-1 border-t border-current/20 text-xs opacity-80 whitespace-pre-wrap">
                      {a.headline}
                      {a.expires && (
                        <div className="mt-1 opacity-60">
                          Expires: {new Date(a.expires).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* USGS Earthquakes */}
      <section>
        <h3 className="text-xs text-blue-500 uppercase tracking-widest font-semibold mb-2">
          Recent Earthquakes nearby (M3.0+, 30 days)
        </h3>
        {quakes.length === 0 ? (
          <div className="flex items-center gap-3 bg-green-950/40 border border-green-700 rounded-xl p-3">
            <span className="text-xl">✅</span>
            <p className="text-sm text-green-300">No significant earthquakes recorded nearby</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {quakes.map((q) => {
              const mag = q.magnitude;
              const color = mag >= 6 ? '#ef4444' : mag >= 5 ? '#f97316' : mag >= 4 ? '#eab308' : '#22c55e';
              return (
                <a
                  key={q.id}
                  href={q.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors border border-blue-800/50 hover:border-blue-600"
                  style={{ background: '#0a1e35' }}
                >
                  <div className="text-sm font-extrabold shrink-0 w-12 text-center" style={{ color }}>
                    M{mag.toFixed(1)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-blue-200 truncate">{q.place}</div>
                    <div className="text-xs text-blue-600">
                      {new Date(q.time).toLocaleDateString()} · {q.depth_km.toFixed(0)} km deep
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
