import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import { apiGet } from '@/lib/apiClient'
import type { WeatherResponse, GeoLocation } from '@/types/weather'
import { getStoredLocation, storeLocation } from '@/lib/geolocation'

const DEFAULT_LOCATION: GeoLocation = {
  lat: -1.2921,
  lon: 36.8219,
  name: 'Nairobi',
  region: 'Nairobi',
  country: 'Kenya',
}

interface UseWeatherOptions {
  days?: number
  ai?: boolean
}

interface UseWeatherResult {
  location: GeoLocation
  setLocation: (loc: GeoLocation) => void
  refetchLocation: () => void
}

export function useWeather(options: UseWeatherOptions = {}): UseWeatherResult & ReturnType<typeof useWeatherQuery> {
  const { days = 7, ai = false } = options

  // Use state to track location and allow updates
  const [location, setLocationState] = useState<GeoLocation>(() => {
    const stored = getStoredLocation()
    return stored || DEFAULT_LOCATION
  })

  // Query for weather data - depends on location coordinates
  const weatherQuery = useWeatherQuery(location, { days, ai })

  // Store refetch function in ref so it can be accessed in useEffect
  const refetchRef = useRef(weatherQuery.refetch)
  refetchRef.current = weatherQuery.refetch

  // Only listen for storage changes from other tabs - NOT on every mount
  useEffect(() => {
    const handleStorage = () => {
      const stored = getStoredLocation()
      if (stored) {
        setLocationState(stored)
        refetchRef.current()
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const setLocation = (loc: GeoLocation) => {
    storeLocation(loc)
    setLocationState(loc)
    // Invalidate queries with old location to force refetch
    weatherQuery.refetch()
  }

  const refetchLocation = () => {
    const stored = getStoredLocation()
    if (stored) {
      setLocationState(stored)
      weatherQuery.refetch()
    }
  }

  return {
    location,
    setLocation,
    refetchLocation,
    ...weatherQuery,
  }
}

function useWeatherQuery(location: GeoLocation, options: UseWeatherOptions) {
  const { days = 7, ai = false } = options
  const locationKey = `${location.lat},${location.lon}`

  return useQuery({
    queryKey: ['weather', locationKey, days, ai],
    queryFn: async (): Promise<WeatherResponse> => {
      const params = new URLSearchParams({
        lat: String(location.lat),
        lon: String(location.lon),
        days: String(days),
        ai: String(ai),
      })

      return apiGet<WeatherResponse>(`/api/weather?${params}`)
    },
    staleTime: 1000 * 60 * 15, // 15 minutes - data stays fresh for 15 min
    gcTime: 1000 * 60 * 60, // 1 hour cache - keep unused data for 1 hour
    retry: 1,
    refetchOnWindowFocus: false, // Don't refetch on tab switch
    refetchOnMount: false, // Don't refetch on component mount
  })
}

export function useGeoLocation() {
  return useQuery({
    queryKey: ['geo'],
    queryFn: async (): Promise<GeoLocation> => {
      const data = await apiGet<WeatherResponse>('/api/geo')
      return {
        lat: data.lat,
        lon: data.lon,
        name: data.geo?.city || 'Unknown',
        region: data.geo?.region,
        country: data.geo?.country,
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
    enabled: false, // Manual trigger only
  })
}

// Mock data for development without API key
export const MOCK_WEATHER: WeatherResponse = {
  lat: -1.2921,
  lon: 36.8219,
  units: 'metric',
  days: 7,
  current: {
    time: '2026-07-14T12:00',
    interval: 900,
    temperature: 22,
    windspeed: 15,
    winddirection: 90,
    is_day: 1,
    weathercode: 3,
  },
  daily: [
    { date: '2026-07-14', temp_max: 25, temp_min: 15, precipitation: 0, weathercode: 3 },
    { date: '2026-07-15', temp_max: 24, temp_min: 14, precipitation: 5, weathercode: 51 },
    { date: '2026-07-16', temp_max: 23, temp_min: 15, precipitation: 15, weathercode: 61 },
    { date: '2026-07-17', temp_max: 22, temp_min: 14, precipitation: 20, weathercode: 63 },
    { date: '2026-07-18', temp_max: 21, temp_min: 13, precipitation: 8, weathercode: 3 },
    { date: '2026-07-19', temp_max: 22, temp_min: 14, precipitation: 2, weathercode: 2 },
    { date: '2026-07-20', temp_max: 24, temp_min: 15, precipitation: 0, weathercode: 1 },
  ],
  hourly: [
    { time: '2026-07-14T12:00', temp: 22, precipitation: 0, weathercode: 3 },
    { time: '2026-07-14T13:00', temp: 23, precipitation: 0, weathercode: 3 },
    { time: '2026-07-14T14:00', temp: 24, precipitation: 0, weathercode: 2 },
    { time: '2026-07-14T15:00', temp: 24, precipitation: 0, weathercode: 2 },
    { time: '2026-07-14T16:00', temp: 23, precipitation: 0, weathercode: 2 },
    { time: '2026-07-14T17:00', temp: 21, precipitation: 0, weathercode: 2 },
  ],
  ai_summary: 'Nairobi will experience partly cloudy conditions with temperatures around 22-24°C. Light rain expected mid-week.',
}