import { Router } from 'express'
import multer from 'multer'
import { weatherAiPost, weatherAiGet } from '../weatherAiClient'
import FormData from 'form-data'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB - match client-side limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'))
    }
  },
})

// POST /api/trees/analyze - Analyze tree canopy from image
router.post('/trees/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Image is required' })
      return
    }

    const { farmerId, county, landAcres, location, notes } = req.body

    const formData = new FormData()
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    })
    if (farmerId) formData.append('farmerId', farmerId)
    if (county) formData.append('county', county)
    if (landAcres) formData.append('landAcres', String(landAcres))
    if (location) formData.append('location', location)
    if (notes) formData.append('notes', notes)

    const data = await weatherAiPost('/v1/trees/analyze', formData, true)
    res.json(data)
  } catch (error) {
    console.error('Tree analysis error:', error)
    res.status(500).json({ error: (error as Error).message })
  }
})

// GET /api/trees/history - Get past analyses
router.get('/trees/history', async (req, res) => {
  try {
    const { limit, cursor } = req.query
    const params: Record<string, string> = {}
    if (limit) params.limit = limit as string
    if (cursor) params.cursor = cursor as string

    const data = await weatherAiGet('/v1/trees/history', params)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// GET /api/trees/quota - Get tree analysis quota
router.get('/trees/quota', async (_req, res) => {
  try {
    const data = await weatherAiGet('/v1/trees/quota')
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

export default router