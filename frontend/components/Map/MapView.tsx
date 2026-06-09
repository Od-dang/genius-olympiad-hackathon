'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RiskAssessment, RISK_COLORS, RiskLevel } from '@/types';

// We always use createRiskIcon (divIcon), so suppress Leaflet's broken default icon warning
delete (L.Icon.Default.prototype as any)._getIconUrl;

function createRiskIcon(level: RiskLevel): L.DivIcon {
  const color = RISK_COLORS[level];
  const isCritical = level === 'CRITICAL';
  return L.divIcon({
    html: `<div style="
      background: ${color};
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 0 0 ${color};
      ${isCritical ? 'animation: risk-pulse 1.5s infinite;' : ''}
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
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
  onLocationSelect: (lat: number, lon: number) => void;
}

export default function MapView({ selectedLocation, assessment, onLocationSelect }: Props) {
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
          icon={createRiskIcon(assessment?.highestRisk ?? 'NONE')}
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
