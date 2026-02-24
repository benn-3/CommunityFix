const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const { validateEnv, config } = require('./config/env')
const errorHandler = require('./middleware/errorHandler')

// ── Validate env vars (crashes if missing) ──
validateEnv()

// ── Connect to MongoDB ──
connectDB()

const app = express()

// ── Security Headers ──
app.use(helmet())

// ── CORS ──
app.use(cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Request Logging ──
app.use(morgan(config.isProduction ? 'combined' : 'dev'))

// ── Body Parsing (with size limit) ──
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: false, limit: '10kb' }))

// ── Rate Limiting ──
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later' },
})
app.use(globalLimiter)

// Stricter rate limit for auth routes (brute-force protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many authentication attempts, try again in 15 minutes' },
})
app.use('/auth', authLimiter)

// ── Health Check ──
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    })
})

// ── API Routes ──
app.use('/auth', require('./routes/auth'))
app.use('/issues', require('./routes/issues'))
app.use('/admin', require('./routes/admin'))
app.use('/categories', require('./routes/categories'))
app.use('/upload', require('./routes/upload'))

// ── Root ──
app.get('/', (req, res) => res.json({ success: true, message: 'CommunityFix API v1.0' }))

// ── 404 Handler ──
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// ── Global Error Handler (must be LAST) ──
app.use(errorHandler)

// ── Start Server ──
const server = app.listen(config.port, () => {
    console.log(`\n🚀 Server running on port ${config.port} [${config.nodeEnv}]`)
    console.log(`   Health: http://localhost:${config.port}/health\n`)
})

// ── Graceful Shutdown ──
const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`)
    server.close(() => {
        console.log('HTTP server closed')
        mongoose.connection.close(false).then(() => {
            console.log('MongoDB connection closed')
            process.exit(0)
        })
    })
    // Force exit after 10s
    setTimeout(() => {
        console.error('Forced shutdown after timeout')
        process.exit(1)
    }, 10000)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message)
    shutdown('UNHANDLED_REJECTION')
})

module.exports = app
