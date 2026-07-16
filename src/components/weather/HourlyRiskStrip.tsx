import type { HourlyForecast } from '@/types/weather'
import { formatTime, formatTemperature, getConditionText } from '@/lib/formatters'
import { WeatherIcon } from './WeatherIcon'

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
      <div className="card p-4">
        <p className="text-center text-[var(--color-soil-500)]">No hourly forecast available</p>
      </div>
    )
  }

  // Limit to requested hours
  const limitedData = data.slice(0, maxHours)

  return (
    <div className="card p-4 sm:p-6 animate-fade-up delay-200">
      <h3 className="text-lg font-display font-semibold mb-4 text-[var(--color-forest-700)] dark:text-[var(--color-cream-50)]">
        Next 24 Hours
      </h3>
      <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide">
        {limitedData.map((hour, index) => {
          // Risk thresholds
          const isHighPrecip = hour.precipitation > 5
          const isRisk = isHighPrecip

          return (
            <div
              key={hour.time + index}
              className={`flex-shrink-0 rounded-xl p-2 min-w-[60px] sm:min-w-[70px] text-center transition-all hover:scale-105 ${
                isRisk
                  ? 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700'
                  : 'bg-[var(--color-cream-100)] dark:bg-[var(--color-loam-700)]'
              }`}
            >
              <p className="text-xs text-[var(--color-soil-500)] dark:text-[var(--color-soil-300)]">
                {formatTime(hour.time)}
              </p>
              <div className="flex justify-center my-1" role="img" aria-label={getConditionText(hour.weathercode)}>
                <WeatherIcon condition={hour.weathercode} size="sm" />
              </div>
              <p className="text-sm font-semibold text-[var(--color-soil-900)] dark:text-[var(--color-cream-50)]">
                {formatTemperature(hour.temp, unit)}
              </p>
              {isHighPrecip && (
                <div className="mt-1 flex justify-center">
                  <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}