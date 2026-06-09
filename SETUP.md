# DisasterWatch — Setup Guide

## Prerequisites
- Node.js 18+ (for built-in fetch support)
- npm

---

## Backend (NestJS)

```bash
cd backend
cp .env.example .env
# Edit .env and add your OpenWeatherMap API key
npm install
npm run start:dev
# Runs on http://localhost:3001
```

**API endpoints:**
- `GET /api/risk?lat=&lon=` — full risk assessment (main endpoint)
- `GET /api/weather?lat=&lon=` — raw weather data
- `GET /api/disasters/fema?state=CA` — FEMA declarations (state optional)
- `GET /api/disasters/earthquakes?lat=&lon=&radius=500` — USGS earthquakes
- `GET /api/disasters/alerts?lat=&lon=` — NWS active weather alerts
- `GET /api/disasters/geocode?q=Miami` — Nominatim geocoding
- `GET /api/tips` — all preparation guides
- `GET /api/tips/WILDFIRE` — specific disaster tips

---

## Frontend (Next.js)

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## Architecture

```
User clicks map
  → POST /api/risk?lat=X&lon=Y
  → Backend calls OpenWeatherMap (current + 5-day forecast)
  → Risk service scores 7 disaster types against thresholds
  → Returns { weather, risks[], highestRisk, location }
  → Frontend renders map marker (colored by risk) + sidebar panels
```

## Disaster Thresholds Used

| Disaster   | Key Conditions                                        |
|------------|-------------------------------------------------------|
| Tornado    | Temp ≥ 70°F, Dewpoint ≥ 65°F, Humidity ≥ 60%        |
| Hurricane  | Temp ≥ 79°F, Humidity ≥ 80%, Wind ≥ 25 mph          |
| Flood      | Humidity ≥ 90%, Rain ≥ 0.5–2.0 in/hr               |
| Wildfire   | Temp ≥ 90°F, Humidity ≤ 25%, 14+ dry days           |
| Drought    | Humidity ≤ 30%, 14+ dry days, Temp ≥ 95°F           |
| Landslide  | Rain ≥ 4 in/24h, Humidity ≥ 90%, Rain ≥ 1 in/hr    |
| Blizzard   | Temp ≤ 32°F, Humidity ≥ 60%, Wind ≥ 35 mph         |

Risk levels: NONE → LOW (16%+) → MODERATE (36%+) → HIGH (56%+) → CRITICAL (76%+)

## External APIs Used (all free)

| API | Purpose | Key Required |
|-----|---------|--------------|
| OpenWeatherMap | Current weather + 5-day forecast | Yes (user-provided) |
| FEMA Open API | Historical US disaster declarations | No |
| USGS Earthquake Feed | Recent earthquake data | No |
| NWS Alerts API | Active weather warnings | No |
| Nominatim (OSM) | Geocoding / city search | No |
