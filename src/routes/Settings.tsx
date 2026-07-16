import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { storeLocation } from '@/lib/geolocation'

function Settings() {
  const navigate = useNavigate()
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')
  const [lang, setLang] = useState<'en' | 'sw'>('en')

  // Load saved settings on mount
  useEffect(() => {
    const saved = localStorage.getItem('weatherai_settings')
    if (saved) {
      const settings = JSON.parse(saved)
      setLat(settings.lat || '')
      setLon(settings.lon || '')
      setUnits(settings.units || 'metric')
      setLang(settings.lang || 'en')
    }
  }, [])

  const handleSave = () => {
    const settings = { lat, lon, units, lang }
    localStorage.setItem('weatherai_settings', JSON.stringify(settings))

    // If valid coordinates, also update the location for weather
    if (lat && lon) {
      const latNum = parseFloat(lat)
      const lonNum = parseFloat(lon)
      if (!isNaN(latNum) && !isNaN(lonNum)) {
        const location = { lat: latNum, lon: lonNum, name: 'Custom Location' }
        storeLocation(location)
      }
    }

    alert('Settings saved!')
    navigate('/')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Settings</h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-medium">Location Override</h3>
        <p className="text-sm text-slate-500">
          Set manual coordinates instead of auto-detecting
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="-1.2921"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              type="text"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="36.8219"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-medium">Preferences</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Units</label>
          <select
            value={units}
            onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial')}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
          >
            <option value="metric">Metric (°C, km/h)</option>
            <option value="imperial">Imperial (°F, mph)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as 'en' | 'sw')}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
          >
            <option value="en">English</option>
            <option value="sw">Swahili</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors"
      >
        Save Settings
      </button>
    </div>
  )
}

export default Settings