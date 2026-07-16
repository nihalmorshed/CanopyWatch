import type { DailyForecast } from '@/types/weather'
import { formatDayName, formatShortDate, formatTemperature, getConditionText, formatPrecip } from '@/lib/formatters'
import { WeatherIcon } from './WeatherIcon'

interface ForecastStripProps {
  data: DailyForecast[]
  unit?: 'metric' | 'imperial'
}

export default function ForecastStrip({
  data,
  unit = 'metric',
}: ForecastStripProps) {
  if (!data || data.length === 0) {
    return (
      <div className="card p-6">
        <p className="text-center text-[var(--color-soil-500)]">No forecast available</p>
      </div>
    )
  }

  return (
    <div className="card p-4 sm:p-6 animate-fade-up delay-100">
      <h3 className="text-lg font-display font-semibold mb-4 text-[var(--color-forest-700)] dark:text-[var(--color-cream-50)]">
        7-Day Forecast
      </h3>
      <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 scrollbar-hide">
        {data.map((day, index) => (
          <div
            key={day.date + index}
            className="flex-shrink-0 bg-[var(--color-cream-100)] dark:bg-[var(--color-loam-700)] rounded-xl p-3 sm:p-4 min-w-[80px] sm:min-w-[90px] text-center transition-transform hover:scale-105"
          >
            <p className="text-sm font-semibold text-[var(--color-forest-700)] dark:text-[var(--color-cream-50)]">
              {index === 0 ? 'Today' : formatDayName(day.date)}
            </p>
            <p className="text-xs text-[var(--color-soil-500)] dark:text-[var(--color-soil-300)] mb-2">
              {formatShortDate(day.date)}
            </p>
            <div className="flex justify-center mb-2" role="img" aria-label={getConditionText(day.weathercode)}>
              <WeatherIcon condition={day.weathercode} size="md" />
            </div>
            <div className="flex justify-center gap-1 text-sm">
              <span className="font-semibold text-[var(--color-soil-900)] dark:text-[var(--color-cream-50)]">
                {formatTemperature(day.temp_max, unit)}
              </span>
              <span className="text-[var(--color-soil-400)]">/</span>
              <span className="text-[var(--color-soil-500)]">
                {formatTemperature(day.temp_min, unit)}
              </span>
            </div>
            {day.precipitation > 0 && (
              <div className="mt-2 flex items-center justify-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" clipRule="evenodd" />
                </svg>
                <span>{formatPrecip(day.precipitation)} mm</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}