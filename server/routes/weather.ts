import { Router } from 'express'
import { weatherAiGet } from '../weatherAiClient'

const router = Router()

// GET /api/weather - Full weather data
router.get('/weather', async (req, res) => {
  try {
    const { lat, lon, days, ai, units, lang } = req.query
    const params: Record<string, string> = {}
    if (lat) params.lat = lat as string
    if (lon) params.lon = lon as string
    if (days) params.days = days as string
    if (ai) params.ai = ai as string
    if (units) params.units = units as string
    if (lang) params.lang = lang as string

    const data = await weatherAiGet('/v1/weather', params)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// GET /api/current - Current conditions
router.get('/current', async (req, res) => {
  try {
    const { lat, lon, units, lang } = req.query
    const params: Record<string, string> = {}
    if (lat) params.lat = lat as string
    if (lon) params.lon = lon as string
    if (units) params.units = units as string
    if (lang) params.lang = lang as string

    const data = await weatherAiGet('/v1/current', params)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// GET /api/daily - Daily forecast
router.get('/daily', async (req, res) => {
  try {
    const { lat, lon, days, units, lang } = req.query
    const params: Record<string, string> = {}
    if (lat) params.lat = lat as string
    if (lon) params.lon = lon as string
    if (days) params.days = days as string
    if (units) params.units = units as string
    if (lang) params.lang = lang as string

    const data = await weatherAiGet('/v1/daily', params)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// GET /api/hourly - Hourly forecast
router.get('/hourly', async (req, res) => {
  try {
    const { lat, lon, days, units, lang } = req.query
    const params: Record<string, string> = {}
    if (lat) params.lat = lat as string
    if (lon) params.lon = lon as string
    if (days) params.days = days as string
    if (units) params.units = units as string
    if (lang) params.lang = lang as string

    const data = await weatherAiGet('/v1/hourly', params)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// GET /api/geo - Auto-location via IP
router.get('/geo', async (req, res) => {
  try {
    const data = await weatherAiGet('/v1/weather-geo', { ip: 'auto' })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

export default router