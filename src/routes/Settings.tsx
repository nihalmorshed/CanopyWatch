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
        const locationName = latNum === -1.2921 && lonNum === 36.8219
          ? 'Nairobi'
          : latNum === 0.5143 && lonNum === 35.2698
          ? 'Kerwa'
          : 'Custom Location'
        const location = { lat: latNum, lon: lonNum, name: locationName }
        storeLocation(location)
      }
    }

    alert('Settings saved!')
    navigate('/')
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-xl font-display font-semibold text-[var(--color-forest-700)] dark:text-[var(--color-cream-50)]">
        Settings
      </h2>

      {/* Location Card */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-forest-100)] dark:bg-[var(--color-forest-700)] rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--color-forest-600)] dark:text-[var(--color-forest-300)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-forest-700)] dark:text-[var(--color-cream-50)]">
              Location Override
            </h3>
            <p className="text-sm text-[var(--color-soil-500)]">
              Set manual coordinates
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--color-soil-700)] dark:text-[var(--color-cream-100)]">
              Latitude
            </label>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="-1.2921"
              className="w-full px-4 py-3 border border-[var(--color-cream-200)] dark:border-[var(--color-loam-700)] rounded-xl bg-[var(--color-cream-50)] dark:bg-[var(--color-loam-800)] text-[var(--color-soil-900)] dark:text-[var(--color-cream-50)] focus:ring-2 focus:ring-[var(--color-forest-500)] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--color-soil-700)] dark:text-[var(--color-cream-100)]">
              Longitude
            </label>
            <input
              type="text"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="36.8219"
              className="w-full px-4 py-3 border border-[var(--color-cream-200)] dark:border-[var(--color-loam-700)] rounded-xl bg-[var(--color-cream-50)] dark:bg-[var(--color-loam-800)] text-[var(--color-soil-900)] dark:text-[var(--color-cream-50)] focus:ring-2 focus:ring-[var(--color-forest-500)] focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Preferences Card */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-cream-200)] dark:bg-[var(--color-loam-700)] rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--color-terracotta-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-9.75 0h9.75" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-forest-700)] dark:text-[var(--color-cream-50)]">
              Preferences
            </h3>
            <p className="text-sm text-[var(--color-soil-500)]">
              Customize your experience
            </p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--color-soil-700)] dark:text-[var(--color-cream-100)]">
            Units
          </label>
          <select
            value={units}
            onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial')}
            className="w-full px-4 py-3 border border-[var(--color-cream-200)] dark:border-[var(--color-loam-700)] rounded-xl bg-[var(--color-cream-50)] dark:bg-[var(--color-loam-800)] text-[var(--color-soil-900)] dark:text-[var(--color-cream-50)] focus:ring-2 focus:ring-[var(--color-forest-500)] focus:border-transparent transition-all"
          >
            <option value="metric">Metric (°C, km/h)</option>
            <option value="imperial">Imperial (°F, mph)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--color-soil-700)] dark:text-[var(--color-cream-100)]">
            Language
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as 'en' | 'sw')}
            className="w-full px-4 py-3 border border-[var(--color-cream-200)] dark:border-[var(--color-loam-700)] rounded-xl bg-[var(--color-cream-50)] dark:bg-[var(--color-loam-800)] text-[var(--color-soil-900)] dark:text-[var(--color-cream-50)] focus:ring-2 focus:ring-[var(--color-forest-500)] focus:border-transparent transition-all"
          >
            <option value="en">English</option>
            <option value="sw">Swahili</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="btn-primary w-full py-4 text-lg"
      >
        Save Settings
      </button>
    </div>
  )
}

export default Settings