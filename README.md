# Canopy Watch 🌳

Weather + tree canopy analysis for smallholder farmers and agroforestry users.

## Live Demo

**[ https://canopy-watch.onrender.com/ ]** 

---

## About

Canopy Watch combines hyperlocal weather data with AI-powered tree canopy analysis to help smallholder farmers make data-driven decisions about their agroforestry land.

The app correlates canopy health with weather risks (wind, frost, heat, drought) and surfaces plain-language, prioritized actions.

---

## Features Implemented

### Phase 1 - Weather Core ✅
- **Auto-location** - Automatically detects user location via IP
- **Current Weather** - Live temperature, conditions, wind speed
- **7-Day Forecast** - Daily high/low temperatures, precipitation
- **12-Hour Forecast** - Hourly breakdown with precipitation indicators
- **Location Override** - Manual lat/lon input in Settings

### Phase 2 - Tree Analysis ✅
- **Image Upload** - Drag-drop or click-to-select for canopy photos
- **File Validation** - Client & server-side validation (JPEG/PNG/WEBP, 20MB max)
- **Tree Count** - AI-powered tree detection from drone/satellite/phone photos
- **Health Assessment** - Donut chart showing healthy/needs care/needs replacement
- **Canopy Coverage** - Percentage coverage analysis
- **Species Detection** - AI guess at tree species present
- **Observations & Recommendations** - Gemini-powered agronomic insights
- **Quota Tracking** - Monthly analysis limit display

### Phase 3 - Correlation Engine ✅
- **Risk Assessment** - Cross-references canopy health with weather forecasts
- **Three Risk Types:**
  - 🌬️ **Wind Vulnerability** - Trees needing replacement in storm weather
  - 💧 **Water Stress** - Low canopy cover + hot/dry forecast
  - ❄️ **Frost Risk** - Trees needing care + cold forecast
- **Severity Ranking** - High/Medium/Low with color-coded indicators
- **Actionable Recommendations** - Specific steps for each risk

### Phase 4 - History & Timeline ✅
- **Paginated History** - Load more button for past analyses
- **Trend Chart** - Recharts visualization of canopy health over time
- **Health Metrics** - Tracks canopy %, healthy, needs care, needs replacement
- **Cached Forecasts** - Weather at time of each analysis stored for reference

### Phase 5 - Polish ✅
- **Usage Banner** - API request quota display (1000/month on free tier)
- **Error Handling** - Per-status messages (401, 403, 429, 500, 503)
- **Loading Skeletons** - Animated placeholders during data fetch
- **Empty States** - Friendly messages when no data available
- **Mobile Responsive** - Touch-friendly nav, safe area padding, PWA meta tags

### Performance Optimization ✅
- React Query caching (15-minute staleTime)
- No refetch on window focus
- Single API call per location change
- ~50 requests/month vs ~3000/day

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| State | TanStack Query (React Query) |
| Charts | Recharts |
| Proxy | Express + Multer (Node.js) |
| Testing | Vitest |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │ Analyze  │  │ History  │  │ Settings │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │           │
│       └─────────────┴─────────────┴─────────────┘           │
│                          │                                  │
│              ┌─────────────▼─────────────┐                  │
│              │     TanStack Query       │                  │
│              └─────────────┬─────────────┘                  │
└────────────────────────────┼────────────────────────────────┘
                             │ /api/*
┌────────────────────────────▼────────────────────────────────┐
│                    Express Proxy Server                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ weather │  │  trees   │  │  usage   │  │ health  │     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │             │             │             │           │
│       └─────────────┴─────────────┴─────────────┘           │
│                          │                                  │
│              ┌─────────────▼─────────────┐                  │
│              │   WeatherAI API Client   │                  │
│              │  (adds API key header)   │                  │
│              └─────────────┬─────────────┘                  │
└────────────────────────────┼────────────────────────────────┘
                             │ https://api.weather-ai.co
                             ▼
                    ┌─────────────────┐
                    │   WeatherAI   │
                    │     API        │
                    └─────────────────┘
```

### Why a Backend Proxy?

The WeatherAI API key must **never** be exposed to the browser. The Express proxy:
1. Keeps the API key server-side
2. Handles multipart file uploads (multer)
3. Adds `Authorization: Bearer` header to upstream requests

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone & Install
```bash
git clone <your-repo>
cd canopy-watch
npm install
```

### 2. Environment Variables
```bash
# Copy the example
cp .env.example .env

# Edit .env and add your API key
WEATHERAI_API_KEY=wai_your_key_here
WEATHERAI_BASE_URL=https://api.weather-ai.co
PORT=8787
```

Get your API key from [weather-ai.co](https://weather-ai.co)

### 3. Run Locally

**Option A: Separate terminals (recommended for dev)**
```bash
# Terminal 1: Backend proxy
npm run server

# Terminal 2: Frontend with hot reload
npm run dev
```

**Option B: Single terminal**
```bash
npm run server
```
Then open http://localhost:8787

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## API Endpoints

### Working Endpoints (Free Tier)
| Our Proxy | Upstream | Status |
|-----------|----------|--------|
| `/api/weather` | `/v1/weather` | ✅ Live |
| `/api/geo` | `/v1/weather-geo` | ✅ Live |
| `/api/usage` | `/v1/usage` | ✅ Live |

### Endpoints Requiring Pro/Scale Plan
| Our Proxy | Upstream | Status |
|-----------|----------|--------|
| `/api/trees/analyze` | `/v1/trees/analyze` | ❌ 404 |
| `/api/trees/history` | `/v1/trees/history` | ❌ 404 |
| `/api/trees/quota` | `/v1/trees/quota` | ❌ 404 |

**Note:** The tree analysis endpoints require a Pro or Scale plan on WeatherAI. The app gracefully falls back to mock data when these endpoints return 404.

---

## Deployment

### Render

1. Push to GitHub
2. Create Web Service on [render.com](https://render.com)
3. Configure:
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Environment: Node
   - Add `WEATHERAI_API_KEY` as environment variable

### Other Platforms
- Railway - Similar setup to Render
- Vercel/Netlify - Requires converting Express to serverless functions
- Firebase - Cloud Functions + Hosting

---

## Project Structure

```
canopy-watch/
├── server/                    # Express proxy backend
│   ├── index.ts              # Express app entry
│   ├── routes/
│   │   ├── weather.ts         # /api/weather, /geo
│   │   ├── trees.ts           # /api/trees/*
│   │   └── usage.ts           # /api/usage
│   └── weatherAiClient.ts     # WeatherAPI client
├── src/
│   ├── routes/
│   │   ├── Home.tsx           # Weather display
│   │   ├── Analyze.tsx        # Tree canopy analysis
│   │   ├── History.tsx         # Timeline & trends
│   │   └── Settings.tsx        # Location override
│   ├── components/
│   │   ├── weather/           # WeatherCard, ForecastStrip
│   │   ├── trees/             # ImageUploader, AnalysisResult
│   │   ├── risk/              # RiskPanel
│   │   ├── quota/             # UsageBanner
│   │   └── ui/                # Skeleton, EmptyState, ErrorDisplay
│   ├── hooks/                 # React Query hooks
│   ├── lib/                   # apiClient, riskRules, formatters
│   └── types/                 # TypeScript interfaces
├── tests/                     # Vitest tests
├── CLAUDE.md                  # Project instructions
└── package.json
```

---

## Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage
```


---

## Credits

- Weather data: [WeatherAI API](https://weather-ai.co)
- Icons: Custom SVG weather illustrations
- Fonts: Fraunces (display) + Nunito (body)