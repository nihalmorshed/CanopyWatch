# Canopy Watch

Weather + tree canopy analysis for smallholder farmers and agroforestry users.

## Quick Start

```bash
# Install dependencies
npm install

# Start the proxy server (required for API key security)
npm run server

# In another terminal, start the dev server
npm run dev
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Add your WeatherAI API key:
   ```
   WEATHERAI_API_KEY=wai_your_key_here
   ```

## Features

- **Weather Data** - Current conditions and 7-day forecast
- **Tree Canopy Analysis** - AI-powered tree count, health assessment
- **Risk Correlation** - Cross-reference canopy health with weather risks
- **History Tracking** - Track canopy health over time

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- TanStack Query
- Express proxy server