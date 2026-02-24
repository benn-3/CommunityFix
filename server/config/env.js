/**
 * Environment configuration and validation
 * Crashes the app on startup if required variables are missing
 */

const dotenv = require('dotenv')
dotenv.config()

const required = ['MONGO_URI', 'JWT_SECRET']
const optional = ['PORT', 'CLIENT_URL', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']

function validateEnv() {
    const missing = required.filter(key => !process.env[key])
    if (missing.length > 0) {
        console.error(`\n❌ FATAL: Missing required environment variables:\n   ${missing.join(', ')}\n`)
        console.error('   Create a .env file based on .env.example and set these values.\n')
        process.exit(1)
    }

    // Warn about missing optional vars
    const missingOptional = optional.filter(key => !process.env[key])
    if (missingOptional.length > 0) {
        console.warn(`⚠️  Missing optional environment variables: ${missingOptional.join(', ')}`)
    }
}

const config = {
    port: parseInt(process.env.PORT, 10) || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
}

module.exports = { validateEnv, config }
