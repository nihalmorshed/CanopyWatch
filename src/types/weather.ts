// Weather response types - verified against live API response

export interface GeoLocation {
  lat: number
  lon: number
  name?: string
  region?: string
  country?: string
}

export interface WeatherResponse {
  lat: number
  lon: number
  units: 'metric' | 'imperial'
  days: number
  current?: CurrentWeather
  daily?: DailyForecast[]
  hourly?: HourlyForecast[]
  ai_summary: string | null
  geo?: GeoInfo
}

export interface GeoInfo {
  ip: string
  ip_version: string
  lat: number
  lon: number
  city: string
  region: string
  country: string
  timezone: string
  isp: string | null
  asn: string | null
  is_datacenter: boolean
}

export interface CurrentWeather {
  time: string
  interval: number
  temperature: number
  windspeed: number
  winddirection: number
  is_day: number
  weathercode: number
}

export interface DailyForecast {
  date: string
  temp_max: number
  temp_min: number
  precipitation: number
  weathercode: number
}

export interface HourlyForecast {
  time: string
  temp: number
  precipitation: number
  weathercode: number
}

// WMO Weather interpretation codes (WMO Code 0)
// https://open-meteo.com/en/docs
export const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}

export function getConditionFromCode(code: number): string {
  return WEATHER_CODES[code] || 'Unknown'
}