import { WEATHER_CODES } from '@/types/weather'

/**
 * Format temperature with unit based on user preference
 */
export function formatTemperature(
  tempC: number,
  unit: 'metric' | 'imperial' = 'metric'
): string {
  if (unit === 'imperial') {
    const tempF = Math.round((tempC * 9) / 5 + 32)
    return `${tempF}°F`
  }
  return `${Math.round(tempC)}°C`
}

/**
 * Format wind speed with unit
 */
export function formatWindSpeed(
  kph: number,
  unit: 'metric' | 'imperial' = 'metric'
): string {
  if (unit === 'imperial') {
    const mph = Math.round(kph * 0.621371)
    return `${mph} mph`
  }
  return `${Math.round(kph)} km/h`
}

/**
 * Format date for display (e.g., "Mon", "Tue")
 */
export function formatDayName(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

/**
 * Format date for display (e.g., "Jul 14")
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Format full date (e.g., "Monday, July 14")
 */
export function formatFullDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format time (e.g., "2:00 PM")
 */
export function formatTime(timeString: string): string {
  const date = new Date(timeString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Get weather icon based on condition string or WMO weather code
 */
export function getWeatherIcon(condition: string | number): string {
  // Handle WMO weather code
  if (typeof condition === 'number') {
    const code = condition
    if (code === 0) return '☀️'
    if (code === 1) return '🌤️'
    if (code === 2) return '⛅'
    if (code === 3) return '☁️'
    if (code >= 45 && code <= 48) return '🌫️'
    if (code >= 51 && code <= 57) return '🌧️'
    if (code >= 61 && code <= 67) return '🌧️'
    if (code >= 71 && code <= 77) return '❄️'
    if (code >= 80 && code <= 82) return '🌧️'
    if (code >= 85 && code <= 86) return '❄️'
    if (code >= 95) return '⛈️'
    return '🌤️'
  }

  // Handle condition string
  const c = condition.toLowerCase()

  if (c.includes('sun') || c.includes('clear')) return '☀️'
  if (c.includes('partly')) return '⛅'
  if (c.includes('cloud') || c.includes('overcast')) return '☁️'
  if (c.includes('rain') || c.includes('drizzle')) return '🌧️'
  if (c.includes('thunder') || c.includes('storm')) return '⛈️'
  if (c.includes('snow')) return '❄️'
  if (c.includes('fog') || c.includes('mist')) return '🌫️'
  if (c.includes('wind')) return '💨'

  return '🌤️'
}

/**
 * Get condition text from WMO weather code
 */
export function getConditionText(code: number): string {
  return WEATHER_CODES[code] || 'Unknown'
}

/**
 * Format precipitation
 */
export function formatPrecip(mm: number): string {
  if (mm === 0) return '0'
  if (mm < 1) return '<1'
  return Math.round(mm).toString()
}

/**
 * Get feels-like temperature (simplified - real calculation would need more data)
 */
export function getFeelsLike(temp: number, _windSpeed: number, _humidity: number): number {
  // Simplified wind chill / heat index approximation
  // At moderate temps, no extreme adjustment needed
  return temp
}