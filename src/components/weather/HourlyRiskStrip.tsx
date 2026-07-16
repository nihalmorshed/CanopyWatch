import type { HourlyForecast } from '@/types/weather'
import { formatTime, formatTemperature, getWeatherIcon, getConditionText } from '@/lib/formatters'

interface HourlyRiskStripProps {
  data: HourlyForecast[]
  unit?: 'metric' | 'imperial'
  maxHours?: number
}

export default function HourlyRiskStrip({
  data,
  unit = 'metric',
  maxHours = 24,
}: HourlyRiskStripProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
        <p className="text-slate-500 text-center">No hourly forecast available</p>
      </div>
    )
  }

  // Limit to requested hours
  const limitedData = data.slice(0, maxHours)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">Next 24 Hours</h3>
      <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4">
        {limitedData.map((hour, index) => {
          // Risk thresholds - simplified for now
          const isHighWind = hour.precipitation > 10 // High precipitation as proxy
          const isHighRain = hour.precipitation > 2

          return (
            <div
              key={hour.time + index}
              className={`flex-shrink-0 rounded-lg p-2 min-w-[60px] text-center ${
                isHighWind || isHighRain
                  ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700'
                  : 'bg-slate-50 dark:bg-slate-700/50'
              }`}
            >
              <p className="text-xs text-slate-500">
                {formatTime(hour.time)}
              </p>
              <span className="text-xl block my-1" role="img" aria-label={getConditionText(hour.weathercode)}>
                {getWeatherIcon(hour.weathercode)}
              </span>
              <p className="text-sm font-medium">
                {formatTemperature(hour.temp, unit)}
              </p>
              {(isHighWind || isHighRain) && (
                <div className="mt-1">
                  {isHighWind && <span className="text-xs">💨</span>}
                  {isHighRain && <span className="text-xs">🌧️</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}