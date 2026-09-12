const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const uri = process.env.MONGODB_URI

const PHONE_NUMBER_PATTERN = /^\d{2,3}-\d+$/

mongoose.connect(uri)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


function isPhoneNumberValid(v) {
  return PHONE_NUMBER_PATTERN.test(v)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    minlength: [8, 'Number must be at least 8 characters long'],
    required: [true, 'Number is required'],
    validate: {
      validator: isPhoneNumberValid,
      message: 'Phone number must be in the format XX-XXXXXXX or XXX-XXXXXXX',
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)