export interface GeoPosition {
  lat: number
  lon: number
}

export interface GeoLocation extends GeoPosition {
  name?: string
  region?: string
  country?: string
}

export function getStoredLocation(): GeoLocation | null {
  try {
    const stored = localStorage.getItem('weatherai_location')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return null
}

export function storeLocation(location: GeoLocation): void {
  try {
    localStorage.setItem('weatherai_location', JSON.stringify(location))
  } catch {
    // Ignore storage errors
  }
}

export function getBrowserLocation(): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      (error) => {
        reject(new Error(error.message))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  })
}