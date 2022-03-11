const express = require('express')
const cors = require('cors')
const UserRoutes = require('../backend/routers/UserRoutes')
const PetRoutes = require('../backend/routers/PetRoutes')

const app = express()

// Config JSON response
app.use(express.json())

// Solve CORS
app.use(cors({ credentials:true, origin: 'http://localhost:3000'}))

// public folder for images
app.use(express.static('public'))

// Routes
app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

app.listen(5000)