require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

// let persons = [
//   {
//     'name': 'Arto Hellas',
//     'number': '040-1234567',
//     'id': 1
//   },
//   {
//     'name': 'Ada Lovelace',
//     'number': '39-44-5323523',
//     'id': 2
//   },
//   {
//     'name': 'Dan Abramov',
//     'number': '12-43-234345',
//     'id': 3
//   },
//   {
//     'name': 'Mary Poppendieck',
//     'number': '39-23-6423122',
//     'id': 4
//   },
// ]


app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(people => {
    res.json(people)
  })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  const date = new Date()
  Person.find({}).then(people => {
    res.json(
      `Phonebook has info for ${people.length} people ${date}`
    )
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(people => {
    if(people) {
      response.json(people)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  // console.log(req)
  // console.log(body)

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }
  // if (persons.find(person => person['name'] === body.name)) {
  //   return res.status(400).json({
  //     error: `${body.name} is already in the phonebook`
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor((Math.random()*1000))
  })

  // console.log(person)

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidator: true, context: 'query' })
    .then(
      updatedPerson => {
        res.json(updatedPerson)
      })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

