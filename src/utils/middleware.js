/** @type {import('express').ErrorRequestHandler} */
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const morgan = require('morgan')
morgan.token('body', (request) => {
    return JSON.stringify(request.body)
})
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

module.exports = {errorHandler, unknownEndpoint, requestLogger}