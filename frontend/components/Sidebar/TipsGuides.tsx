'use client';

import { useState } from 'react';

const GUIDES = [
  {
    type:'TORNADO', label:'Tornado', emoji:'🌪️',
    description:'Violent rotating column of air from a thunderstorm',
    before:['Identify a safe room: interior, lowest floor, no windows','Prepare 72-hour emergency kit: water, food, medications','Know Tornado Watch vs Warning — watch means conditions favorable','Install NOAA weather radio for nighttime alerts'],
    during:['Go to safe room immediately','Cover head and neck with arms or mattress','Stay away from windows','Outdoors: lie flat in a ditch, cover head — never under a bridge'],
    after:['Watch for downed power lines — stay 50+ feet away','Do not enter damaged buildings until declared safe','Smell gas? Leave and call 911 from outside'],
    contacts:'911 · FEMA: 1-800-621-3362 · Red Cross: 1-800-733-2767',
  },
  {
    type:'HURRICANE', label:'Hurricane', emoji:'🌀',
    description:'Tropical cyclone with sustained winds ≥ 74 mph',
    before:['Board up windows with plywood or hurricane shutters','Stock 7-day supplies: water, food, medications, cash','Evacuate immediately if under mandatory evacuation order','Fill vehicle with gas before the storm'],
    during:['Stay indoors away from windows','Do not go out during the eye — winds return soon','Monitor NOAA Weather Radio for updates'],
    after:['Avoid flooded roads — 6 inches can knock you down','Use generators outdoors only (CO poisoning risk)','Document all damage before cleanup'],
    contacts:'911 · FEMA: 1-800-621-3362 · NHC: nhc.noaa.gov',
  },
  {
    type:'FLOOD', label:'Flood', emoji:'🌊',
    description:'Overflow of water submerging normally dry land',
    before:['Know your flood zone at FEMA msc.fema.gov','Move valuables to higher floors','Consider flood insurance — homeowner policies exclude flooding'],
    during:['"Turn Around, Don\'t Drown" — never drive into floodwater','2 feet of water floats most vehicles','If trapped, go to upper floor and signal for rescue'],
    after:['Do not return until authorities say it is safe','Floodwater is contaminated — avoid all contact','Discard food or medications that touched floodwater'],
    contacts:'911 · FEMA: 1-800-621-3362 · weather.gov',
  },
  {
    type:'WILDFIRE', label:'Wildfire', emoji:'🔥',
    description:'Uncontrolled fire spreading through vegetated areas',
    before:['Create 30-foot defensible space around home','Clean gutters and roof of dead leaves','Prepare a go-bag and know two evacuation routes'],
    during:['Evacuate early — wildfires move faster than expected','If sheltering: close all windows/doors, turn off AC','Wear cotton or wool clothing, cover all skin'],
    after:['Watch for hot spots — fires can reignite days later','Wear N95 mask — smoke particles are harmful','Beware mudslide risk — burned slopes are unstable'],
    contacts:'911 · airnow.gov · NIFC: nifc.gov',
  },
  {
    type:'BLIZZARD', label:'Blizzard', emoji:'❄️',
    description:'Severe snowstorm with strong winds and near-zero visibility',
    before:['Stock 72-hour supplies including blankets and flashlights','Winterize home: insulate pipes, check heating system','Keep a winter car kit: shovel, sand, blanket, jumper cables'],
    during:['Stay indoors — hypothermia and frostbite develop quickly','Never use generators or grills indoors (CO poisoning)','Avoid overexertion shoveling — heart attacks spike in blizzards'],
    after:['Check on elderly neighbors','Clear snow from roof — heavy accumulation can cause collapse','Watch for ice — most injuries happen after the storm'],
    contacts:'911 · weather.gov · Local DPW for road conditions',
  },
];

function GuideCard({ guide }: { guide: typeof GUIDES[0] }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState<'before'|'during'|'after'>('before');

  const tabColor = { before: 'text-blue-300', during: 'text-yellow-300', after: 'text-green-300' }[tab];

  return (
    <div
      className="rounded-xl border border-blue-800/60 overflow-hidden"
      style={{ background: '#0a1e35' }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-800/30 transition-colors text-left"
      >
        <span className="text-2xl">{guide.emoji}</span>
        <div className="flex-1">
          <div className="font-bold text-blue-100">{guide.label}</div>
          <div className="text-xs text-blue-500">{guide.description}</div>
        </div>
        <span className="text-blue-600 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-blue-900 p-3 space-y-3">
          {/* Tabs */}
          <div className="flex gap-1.5">
            {(['before','during','after'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  tab === t
                    ? t === 'before' ? 'bg-blue-600 text-white'
                    : t === 'during' ? 'bg-yellow-500 text-yellow-950'
                    : 'bg-green-600 text-white'
                    : 'bg-blue-900/60 text-blue-400 hover:bg-blue-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <ul className="space-y-1.5">
            {guide[tab].map((tip, i) => (
              <li key={i} className={`text-xs flex gap-2 ${tabColor}`}>
                <span className="shrink-0 opacity-60">›</span>
                <span className="text-blue-200">{tip}</span>
              </li>
            ))}
          </ul>

          <div className="text-xs text-blue-700 pt-1 border-t border-blue-900">
            📞 {guide.contacts}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TipsGuides() {
  return (
    <div className="p-4 space-y-2">
      <p className="text-xs text-blue-600 mb-3">
        Preparation guides for all major disaster types. Click any card to expand.
      </p>
      {GUIDES.map((g) => <GuideCard key={g.type} guide={g} />)}
    </div>
  );
}
