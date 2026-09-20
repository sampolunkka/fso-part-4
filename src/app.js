const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const {errorHandler, unknownEndpoint, requestLogger} = require('./utils/middleware')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

//app.use(express.static('web/dist'))
app.use(express.json())
app.use(requestLogger)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app