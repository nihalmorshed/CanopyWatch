import { useEffect, useState } from 'react'

interface GeoLocation {
  lat: number
  lon: number
  name?: string
}

function Home() {
  const [location, setLocation] = useState<GeoLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Auto-detect location on load
    async function fetchGeo() {
      try {
        const res = await fetch('/api/geo')
        if (!res.ok) throw new Error('Failed to get location')
        const data = await res.json()
        setLocation({
          lat: data.lat || data.location?.lat,
          lon: data.lon || data.location?.lon,
          name: data.name || data.location?.name,
        })
      } catch (err) {
        setError((err as Error).message)
        // Default to a sample location
        setLocation({ lat: -1.2921, lon: 36.8219, name: 'Nairobi' })
      } finally {
        setLoading(false)
      }
    }
    fetchGeo()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading weather...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-4">Current Weather</h2>
        {error && (
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">Location</p>
            <p className="text-2xl font-bold">{location?.name || 'Unknown'}</p>
            <p className="text-sm text-slate-500">
              {location?.lat.toFixed(4)}, {location?.lon.toFixed(4)}
            </p>
          </div>
          <p className="text-center text-slate-500 mt-4">
            Weather data will appear here once the API is configured.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/analyze"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl text-center transition-colors"
          >
            <span className="text-2xl block mb-2">📷</span>
            <span>Analyze Canopy</span>
          </a>
          <a
            href="/history"
            className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-4 rounded-xl text-center transition-colors"
          >
            <span className="text-2xl block mb-2">📈</span>
            <span>View History</span>
          </a>
        </div>
      </section>
    </div>
  )
}

export default Home