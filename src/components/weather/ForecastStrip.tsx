import type { DailyForecast } from '@/types/weather'
import { formatDayName, formatShortDate, formatTemperature, getWeatherIcon, getConditionText, formatPrecip } from '@/lib/formatters'

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
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <p className="text-slate-500 text-center">No forecast available</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">7-Day Forecast</h3>
      <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4">
        {data.map((day, index) => (
          <div
            key={day.date + index}
            className="flex-shrink-0 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 min-w-[80px] text-center"
          >
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {index === 0 ? 'Today' : formatDayName(day.date)}
            </p>
            <p className="text-xs text-slate-500 mb-2">
              {formatShortDate(day.date)}
            </p>
            <span className="text-2xl block mb-2" role="img" aria-label={getConditionText(day.weathercode)}>
              {getWeatherIcon(day.weathercode)}
            </span>
            <div className="flex justify-center gap-1 text-sm">
              <span className="font-medium">{formatTemperature(day.temp_max, unit)}</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-500">{formatTemperature(day.temp_min, unit)}</span>
            </div>
            {day.precipitation > 0 && (
              <div className="mt-2 flex items-center justify-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <span>💧</span>
                <span>{formatPrecip(day.precipitation)} mm</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}