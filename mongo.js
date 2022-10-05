const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]



const url =
  `mongodb+srv://fullstack:${password}@cluster0.byeywez.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

if(name && number) {
    person.save().then(result => {
    console.log(`added ${name} with number: ${number} to the phonebook`)
    mongoose.connection.close()
    })
} else {
    Person.find({}).then(result =>{
        console.log('Phonebook:')
        result.forEach(people => {
            console.log(`${people.name} ${people.number}`)
        })
        mongoose.connection.close()
    })
}