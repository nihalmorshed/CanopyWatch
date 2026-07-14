import express from 'express'
import cors from 'cors'
import weatherRoutes from './routes/weather'
import treesRoutes from './routes/trees'
import usageRoutes from './routes/usage'

const app = express()
const PORT = process.env.PORT || 8787

// Middleware
app.use(cors())
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api', weatherRoutes)
app.use('/api', treesRoutes)
app.use('/api', usageRoutes)

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
})

export default app