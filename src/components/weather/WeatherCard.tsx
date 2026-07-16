import type { CurrentWeather } from '@/types/weather'
import { formatTemperature, formatWindSpeed, getConditionText } from '@/lib/formatters'
import { WeatherIcon } from './WeatherIcon'

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
    <div className="card p-6 sm:p-8 animate-fade-up">
      {locationName && (
        <div className="text-center mb-6">
          <p className="text-sm text-[var(--color-soil-500)] dark:text-[var(--color-soil-300)] uppercase tracking-wider font-medium">
            Current Weather
          </p>
          <h3 className="text-2xl sm:text-3xl font-display font-semibold mt-2 text-[var(--color-forest-700)] dark:text-[var(--color-cream-50)]">
            {locationName}
          </h3>
        </div>
      )}

      <div className="flex items-center justify-center gap-6 mb-8">
        <div className="weather-icon-container animate-scale-in">
          <WeatherIcon condition={weathercode} size="xl" />
        </div>
        <div className="text-center">
          <p className="text-5xl sm:text-6xl font-display font-bold text-[var(--color-soil-900)] dark:text-[var(--color-cream-50)]">
            {formatTemperature(temperature, unit)}
          </p>
          <p className="text-lg text-[var(--color-soil-500)] dark:text-[var(--color-soil-300)] mt-1 font-medium">
            {condition}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--color-cream-100)] dark:bg-[var(--color-loam-700)] rounded-xl p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-[var(--color-soil-500)] dark:text-[var(--color-soil-300)] mb-1">
            Wind
          </p>
          <p className="font-semibold text-[var(--color-forest-700)] dark:text-[var(--color-cream-50)]">
            {formatWindSpeed(windspeed, unit)}
          </p>
        </div>
        <div className="bg-[var(--color-cream-100)] dark:bg-[var(--color-loam-700)] rounded-xl p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-[var(--color-soil-500)] dark:text-[var(--color-soil-300)] mb-1">
            Time of Day
          </p>
          <p className="font-semibold text-[var(--color-forest-700)] dark:text-[var(--color-cream-50)] flex items-center justify-center gap-2">
            {is_day === 1 ? (
              <>
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" fillRule="evenodd" clipRule="evenodd" />
                </svg>
                Day
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                Night
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}