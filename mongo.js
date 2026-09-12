require('dotenv').config()

const mongoose = require('mongoose')
const Person = require('./src/model/person')

const password = process.argv[2]
const name = process.argv[3]
const phoneNumber = process.argv[4]

//@formatter:off
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}` +
    `:${password}` +
    `@${process.env.MONGODB_CLUSTER}`
//@formatter:on

function init() {
  return mongoose.connect(uri)
    .then(() => {
      console.log('connected to MongoDB')
    })
}

function insertPerson(name, phoneNumber) {
  const person = new Person({
    name: name, number: phoneNumber,
  })

  return person.save()
    .then(() => console.log(`added ${name} ${phoneNumber} to phonebook`))
}

function getAllPersons() {
  return Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
  })
}

init()
  .then(() => {
    if (name && phoneNumber) {
      return insertPerson(name, phoneNumber)
    } else if (!name && !phoneNumber) {
      return getAllPersons()
    } else {
      console.log('Instructions: \n' + 'INSERT: node mongo [password] [name] [phone number]\n' + 'LIST ALL: node mongo [password]')
    }
  })
  .then(() => mongoose.connection.close())
  .catch(error => {
    console.log(error)
    return mongoose.connection.close()
  })