'use client';

import { useState, useEffect } from 'react';
import { FemaDeclaration } from '@/types';
import { api } from '@/lib/api';

const US_STATES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',
  CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',
  HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',
  KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',
  MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',
  MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',
  NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',
  OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
  SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',
  VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',
};

const DISASTER_ICONS: Record<string, string> = {
  Hurricane:'🌀',Flood:'🌊',Tornado:'🌪️',Earthquake:'🫨',Wildfire:'🔥',
  Drought:'☀️','Severe Storm':'⛈️',Winter:'❄️','Ice Storm':'🧊',Landslide:'⛰️',
};

function getIcon(type: string): string {
  for (const [k, v] of Object.entries(DISASTER_ICONS)) {
    if (type.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return '⚠️';
}

interface Props { country: string; }

export default function PastDisasters({ country }: Props) {
  const [declarations, setDeclarations] = useState<FemaDeclaration[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    setLoading(true);
    api.femaDeclarations(selectedState || undefined)
      .then((d) => { setDeclarations(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedState]);

  return (
    <div className="p-4 space-y-3">

      {/* State filter */}
      <div>
        <label className="text-xs text-blue-500 uppercase tracking-widest font-semibold block mb-1.5">
          Filter by state
        </label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full rounded-xl px-3 py-2 text-sm text-blue-200 outline-none border border-blue-700 focus:border-blue-400 transition-colors"
          style={{ background: '#0a1e35' }}
        >
          <option value="">All states (recent 30)</option>
          {Object.entries(US_STATES).map(([abbr, name]) => (
            <option key={abbr} value={abbr}>{name} ({abbr})</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 gap-3 text-blue-400 text-sm">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          Loading FEMA data...
        </div>
      ) : declarations.length === 0 ? (
        <p className="text-blue-500 text-sm text-center py-8">No declarations found</p>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-blue-700">
            Source: FEMA Disaster Declarations · {declarations.length} most recent
          </div>
          {declarations.map((d) => (
            <div
              key={d.disasterNumber}
              className="rounded-xl p-3 border border-blue-800/60 hover:border-blue-600 transition-colors"
              style={{ background: '#0a1e35' }}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xl shrink-0">{getIcon(d.disasterType)}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-blue-100 leading-snug">
                    {d.declarationTitle}
                  </div>
                  <div className="text-xs text-blue-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span>🗺️ {US_STATES[d.state] || d.state}
                      {d.designatedArea ? ` · ${d.designatedArea}` : ''}</span>
                    <span>📅 {new Date(d.declarationDate).toLocaleDateString()}</span>
                    <span className="text-blue-700">#{d.disasterNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
