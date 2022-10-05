const { response } = require("express");
require('dotenv').config()
const express = require("express");
const morgan = require("morgan")
const cors = require("cors");
const Person = require("./models/person");
const app = express();

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-1234567",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
];


app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'))

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then(people =>{
    res.json(people)
  })
});

app.get("/info", (req, res) => {
  const date = new Date()
  Person.find({}).then(people => {
    res.json(
    `Phonebook has info for ${people.length} people ${date}`
    )
  })
    
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(people => {
    if(people) {
      response.json(people)
    } else {
      response.status(404).end()
    }
  })
})


app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
})

app.post('/api/persons', (req, res) => {
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
  
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

