'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { RiskAssessment } from '@/types';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar/Sidebar';
import SearchBar from '@/components/ui/SearchBar';

const MapView = dynamic(() => import('@/components/Map/MapView'), { ssr: false });

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRisk = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setSelectedLocation({ lat, lon });
    try {
      const data = await api.risk(lat, lon);
      setAssessment(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchRisk(pos.coords.latitude, pos.coords.longitude),
      () => setError('Unable to retrieve your location'),
    );
  }, [fetchRisk]);

  return (
    <div className="flex flex-col h-screen" style={{ background: '#020c1a' }}>

      {/* ── Navbar ── */}
      <header
        className="flex items-center gap-4 px-5 py-3 shrink-0 border-b border-blue-900"
        style={{ background: 'linear-gradient(135deg, #0a1e35 0%, #0f2a4a 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🌍</span>
          <div>
            <span className="font-bold text-lg tracking-tight text-white">DisasterWatch</span>
            <span className="hidden sm:block text-blue-400 text-xs ml-2">
              Natural Disaster Risk Monitor
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-blue-700 mx-1" />

        {/* Search */}
        <div className="flex-1 max-w-md">
          <SearchBar onSelect={(lat, lon) => fetchRisk(lat, lon)} />
        </div>

        {/* My Location button */}
        <button
          onClick={handleGeolocate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all shrink-0
                     bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/30 shadow-lg"
        >
          <span>⊙</span>
          <span className="hidden sm:block">My Location</span>
        </button>
      </header>

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            selectedLocation={selectedLocation}
            assessment={assessment}
            loading={loading}
            onLocationSelect={fetchRisk}
          />

          {/* Overlay hint when no location selected */}
          {!selectedLocation && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="rounded-2xl p-7 text-center max-w-sm pointer-events-auto border border-blue-700/60 shadow-2xl"
                style={{ background: 'rgba(10,30,53,0.92)', backdropFilter: 'blur(8px)' }}
              >
                <div className="text-5xl mb-4">🗺️</div>
                <h2 className="text-lg font-bold text-white mb-2">Click anywhere on the map</h2>
                <p className="text-blue-300 text-sm leading-relaxed">
                  Or search for a city above, or hit{' '}
                  <span className="text-blue-400 font-semibold">My Location</span> to get a
                  real-time disaster risk assessment.
                </p>
                <div className="flex justify-center gap-3 mt-4 text-xs text-blue-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Low
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> Moderate
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> High
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Critical
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div
          className="w-96 shrink-0 overflow-hidden flex flex-col border-l border-blue-900"
          style={{ background: '#05111f' }}
        >
          <Sidebar assessment={assessment} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
