const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/issues', require('./routes/issues'))
app.use('/admin', require('./routes/admin'))
app.use('/categories', require('./routes/categories'))
app.use('/upload', require('./routes/upload'))

// simple root route
app.get('/', (req, res) => res.send('API Working...'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
