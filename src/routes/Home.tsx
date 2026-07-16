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
      {/* Error Banner */}
      {error && (
        <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 p-4 rounded-xl border border-amber-200 dark:border-amber-700 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{(error as Error).message}</span>
          </div>
        </div>
      )}

      {/* Weather Card */}
      <section>
        {isLoading ? (
          <div className="bg-white dark:bg-[#283618] rounded-xl p-6 sm:p-8 shadow-sm">
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

      {/* Forecast */}
      <section>
        <ForecastStrip data={displayData.daily || []} unit={unit} />
      </section>

      {/* Hourly */}
      <section>
        <HourlyRiskStrip data={displayData.hourly || []} unit={unit} maxHours={12} />
      </section>

      {/* Quick Actions */}
      <section className="animate-fade-up delay-300">
        <h2 className="text-lg font-display font-semibold mb-4 text-[#1B4332] dark:text-[#FEFAE0]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/analyze"
            className="bg-white dark:bg-[#283618] rounded-xl p-5 text-center group shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <div className="w-14 h-14 bg-[#D8F3DC] dark:bg-[#1B4332] rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-[#1B4332] dark:text-[#95D5B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <span className="font-semibold text-[#1B4332] dark:text-[#FEFAE0]">
              Analyze Canopy
            </span>
          </a>
          <a
            href="/history"
            className="bg-white dark:bg-[#283618] rounded-xl p-5 text-center group shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <div className="w-14 h-14 bg-[#E8E2C9] dark:bg-[#3A4A22] rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-[#BC6C25]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.75c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.75A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.75c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.75a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.75c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.75a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <span className="font-semibold text-[#1B4332] dark:text-[#FEFAE0]">
              View History
            </span>
          </a>
        </div>
      </section>
    </div>
  )
}

export default Home