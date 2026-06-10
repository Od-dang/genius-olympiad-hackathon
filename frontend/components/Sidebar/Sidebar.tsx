'use client';

import { useState } from 'react';
import { RiskAssessment } from '@/types';
import WeatherPanel from './WeatherPanel';
import RiskPanel from './RiskPanel';
import PastDisasters from './PastDisasters';
import NearbyAlerts from './NearbyAlerts';
import TipsGuides from './TipsGuides';
import ThresholdsGuide from './ThresholdsGuide';

const TABS = [
  { id: 'risk',       label: '⚠️ Risk',       title: 'Risk Assessment' },
  { id: 'weather',    label: '🌡️ Weather',    title: 'Current Conditions' },
  { id: 'alerts',     label: '🔔 Alerts',     title: 'Nearby Alerts' },
  { id: 'past',       label: '📋 History',    title: 'Past Disasters' },
  { id: 'tips',       label: '📚 Tips',       title: 'Preparation Guides' },
  { id: 'thresholds', label: '📊 Thresholds', title: 'Disaster Trigger Conditions' },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface Props {
  assessment: RiskAssessment | null;
  loading: boolean;
  error: string | null;
}

export default function Sidebar({ assessment, loading, error }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('risk');
  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="flex flex-col h-full">

      {/* ── Tab bar ── */}
      <div
        className="flex border-b border-blue-900 shrink-0 overflow-x-auto"
        style={{ background: '#0a1e35' }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-400 text-blue-300 bg-blue-900/40'
                : 'border-transparent text-blue-500 hover:text-blue-200 hover:bg-blue-900/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab heading ── */}
      <div
        className="px-4 py-3 border-b border-blue-900 shrink-0"
        style={{ background: '#071525' }}
      >
        <h2 className="font-bold text-blue-100">{currentTab.title}</h2>
        {assessment ? (
          <p className="text-xs text-blue-400 mt-0.5">
            {assessment.location.city
              ? `${assessment.location.city} · ${assessment.location.country}`
              : `${assessment.location.lat.toFixed(3)}, ${assessment.location.lon.toFixed(3)}`}
          </p>
        ) : (
          <p className="text-xs text-blue-600 mt-0.5">No location selected</p>
        )}
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-40 gap-3 text-blue-400">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Fetching data...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="m-4 p-4 bg-red-950/60 border border-red-700 rounded-xl text-sm text-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !assessment && activeTab !== 'tips' && activeTab !== 'thresholds' && (
          <div className="flex flex-col items-center justify-center h-48 text-blue-600 gap-3 px-8 text-center">
            <span className="text-4xl">📍</span>
            <p className="text-sm text-blue-400">Click on the map or search for a location to begin</p>
          </div>
        )}

        {/* Panels */}
        {!loading && !error && assessment && (
          <>
            {activeTab === 'risk'    && <RiskPanel    assessment={assessment} />}
            {activeTab === 'weather' && <WeatherPanel  weather={assessment.weather} />}
            {activeTab === 'alerts'  && <NearbyAlerts lat={assessment.location.lat} lon={assessment.location.lon} />}
            {activeTab === 'past'    && <PastDisasters country={assessment.location.country} />}
            {activeTab === 'tips'       && <TipsGuides />}
            {activeTab === 'thresholds' && <ThresholdsGuide />}
          </>
        )}

        {/* These tabs are available without a location selected */}
        {!loading && !error && !assessment && activeTab === 'tips'       && <TipsGuides />}
        {!loading && !error && !assessment && activeTab === 'thresholds' && <ThresholdsGuide />}
      </div>
    </div>
  );
}
