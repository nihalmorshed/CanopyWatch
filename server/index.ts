import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
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

// Serve static files in production
const isProduction = process.env.NODE_ENV === 'production'
if (isProduction) {
  const staticPath = path.join(__dirname, '../dist')
  app.use(express.static(staticPath))

  // Handle React Router - serve index.html for all non-API routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'))
  })
}

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