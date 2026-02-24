const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI
    if (!uri) {
      console.error('❌ MONGO_URI is not defined')
      process.exit(1)
    }
    await mongoose.connect(uri)
    console.log('✅ MongoDB Connected')

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message)
    })
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected')
    })
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB
