// Weather response types - verify against live API in Phase 1

export interface WeatherResponse {
  location: {
    lat: number
    lon: number
    name?: string
    region?: string
    country?: string
  }
  current?: {
    tempC: number
    tempF: number
    condition: string
    windKph: number
    humidity: number
    precipMm?: number
    feelsLikeC?: number
  }
  daily?: Array<{
    date: string
    tempMinC: number
    tempMaxC: number
    tempMinF?: number
    tempMaxF?: number
    precipMm: number
    windKph: number
    condition: string
    chanceOfRain?: number
  }>
  hourly?: Array<{
    time: string
    tempC: number
    tempF?: number
    precipMm: number
    windKph: number
    condition: string
    chanceOfRain?: number
  }>
  ai_summary?: string
}

export interface CurrentWeather {
  tempC: number
  tempF: number
  condition: string
  windKph: number
  humidity: number
  precipMm?: number
  feelsLikeC?: number
}

export interface DailyForecast {
  date: string
  tempMinC: number
  tempMaxC: number
  precipMm: number
  windKph: number
  condition: string
  chanceOfRain?: number
}

export interface HourlyForecast {
  time: string
  tempC: number
  precipMm: number
  windKph: number
  condition: string
  chanceOfRain?: number
}