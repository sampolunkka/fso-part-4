const express = require('express')
const {errorHandler, unknownEndpoint, requestLogger} = require('./utils/middleware')

const app = express()
console.log('Log')
//app.use(express.static('web/dist'))
app.use(express.json())
app.use(requestLogger)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app