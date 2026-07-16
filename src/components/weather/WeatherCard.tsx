import type { CurrentWeather } from '@/types/weather'
import { formatTemperature, formatWindSpeed, getWeatherIcon, getConditionText } from '@/lib/formatters'

interface WeatherCardProps {
  data: CurrentWeather
  locationName?: string
  unit?: 'metric' | 'imperial'
}

export default function WeatherCard({
  data,
  locationName,
  unit = 'metric',
}: WeatherCardProps) {
  const { temperature, windspeed, weathercode, is_day } = data

  const condition = getConditionText(weathercode)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      {locationName && (
        <div className="text-center mb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Current Weather</p>
          <h3 className="text-xl font-semibold">{locationName}</h3>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mb-6">
        <span className="text-6xl" role="img" aria-label={condition}>
          {getWeatherIcon(weathercode)}
        </span>
        <div className="text-center">
          <p className="text-5xl font-bold">
            {formatTemperature(temperature, unit)}
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-300">{condition}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
          <p className="text-slate-500 dark:text-slate-400">Wind</p>
          <p className="font-medium">{formatWindSpeed(windspeed, unit)}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
          <p className="text-slate-500 dark:text-slate-400">Day/Night</p>
          <p className="font-medium">{is_day === 1 ? '☀️ Day' : '🌙 Night'}</p>
        </div>
      </div>
    </div>
  )
}