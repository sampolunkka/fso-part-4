require('dotenv').config()
const Person = require('./src/model/person')
const express = require('express')
const morgan = require('morgan')

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

const app = express()

const PORT = process.env.PORT

app.use(express.static('web/dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).json({
          error: 'Person not found'
        })
      }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({
          error: 'Person not found'
        })
      }
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(404).json({
      error: 'name missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(result => {
    response.json(result)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  Person.findById(request.params.id)
    .then(person => {

      if (!person) {
        return response.status(404).json({
          error: 'Person not found'
        })
      }

      person.name = body.name
      person.number = body.number

      return person.save().then(result => {
        response.json(result)
      }).catch(error => next(error))
    }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const date = new Date()

  Person.find({})
    .then(persons => {
      response.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
      )
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})