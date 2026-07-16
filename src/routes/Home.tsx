import { useWeather, MOCK_WEATHER } from '@/hooks/useWeather'
import WeatherCard from '@/components/weather/WeatherCard'
import ForecastStrip from '@/components/weather/ForecastStrip'
import HourlyRiskStrip from '@/components/weather/HourlyRiskStrip'
import { useState } from 'react'

function Home() {
  const [unit] = useState<'metric' | 'imperial'>('metric')
  const { data: weather, isLoading, error, location } = useWeather({ days: 7, ai: false })

  // Use mock data if API call fails or returns no data
  const displayData = weather?.current ? weather : MOCK_WEATHER

  // Use location name from settings, fallback to API city, then to default
  const locationName = location?.name || displayData.geo?.city || 'Nairobi'

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 p-3 rounded-lg">
          {(error as Error).message}
        </div>
      )}

      <section>
        {isLoading ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mx-auto"></div>
              <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <WeatherCard
            data={displayData.current!}
            locationName={locationName}
            unit={unit}
          />
        )}
      </section>

      <section>
        <ForecastStrip data={displayData.daily || []} unit={unit} />
      </section>

      <section>
        <HourlyRiskStrip data={displayData.hourly || []} unit={unit} maxHours={12} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/analyze"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl text-center transition-colors"
          >
            <span className="text-2xl block mb-2">📷</span>
            <span>Analyze Canopy</span>
          </a>
          <a
            href="/history"
            className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-4 rounded-xl text-center transition-colors"
          >
            <span className="text-2xl block mb-2">📈</span>
            <span>View History</span>
          </a>
        </div>
      </section>
    </div>
  )
}

export default Home