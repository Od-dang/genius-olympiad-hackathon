'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RiskAssessment, RISK_COLORS, RiskLevel } from '@/types';

// We always use createRiskIcon (divIcon), so suppress Leaflet's broken default icon warning
delete (L.Icon.Default.prototype as any)._getIconUrl;

function createLoadingIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div style="position:relative;width:36px;height:36px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:#3b82f6;animation:marker-ping 1s cubic-bezier(0,0,0.2,1) infinite;"></div>
      <div style="position:absolute;top:4px;left:4px;width:28px;height:28px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.6);"></div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
    className: '',
  });
}

function createRiskIcon(level: RiskLevel): L.DivIcon {
  const color = RISK_COLORS[level];
  const isCritical = level === 'CRITICAL';
  return L.divIcon({
    html: `<div style="
      background: ${color};
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -16],
    className: isCritical ? 'risk-marker-critical' : '',
  });
}

function ClickHandler({ onSelect }: { onSelect: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface Props {
  selectedLocation: { lat: number; lon: number } | null;
  assessment: RiskAssessment | null;
  loading: boolean;
  onLocationSelect: (lat: number, lon: number) => void;
}

export default function MapView({ selectedLocation, assessment, loading, onLocationSelect }: Props) {
  return (
    <MapContainer
      center={[38.5, -96]}
      zoom={4}
      style={{ height: '100%', width: '100%', background: '#0f172a' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      <ClickHandler onSelect={onLocationSelect} />

      {selectedLocation && (
        <Marker
          position={[selectedLocation.lat, selectedLocation.lon]}
          icon={loading ? createLoadingIcon() : createRiskIcon(assessment?.highestRisk ?? 'NONE')}
        >
          {assessment && (
            <Popup className="risk-popup">
              <div className="text-sm font-medium">
                <div className="font-bold">
                  {assessment.location.city || 'Selected Location'}
                </div>
                <div className="text-gray-600 mt-0.5">
                  Highest Risk:{' '}
                  <span
                    style={{ color: RISK_COLORS[assessment.highestRisk] }}
                    className="font-bold"
                  >
                    {assessment.highestRisk}
                  </span>
                </div>
                <div className="text-gray-500 mt-0.5">
                  {Math.round(assessment.weather.temp_f)}°F &middot;{' '}
                  {assessment.weather.humidity}% humidity
                </div>
              </div>
            </Popup>
          )}
        </Marker>
      )}
    </MapContainer>
  );
}
