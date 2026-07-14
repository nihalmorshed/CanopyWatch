import { Router } from 'express'
import { weatherAiGet } from '../weatherAiClient'

const router = Router()

// GET /api/usage - Get API usage stats
router.get('/usage', async (_req, res) => {
  try {
    const data = await weatherAiGet('/v1/usage')
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

export default router