require('dotenv').config()

const TEST = 'test'
const DEV = 'dev'
// const PROD = 'prod'

const PORT = process.env.PORT
const MONGODB_URI = (process.env.NODE_ENV === TEST || process.env.NODE_ENV === DEV)
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

module.exports = {MONGODB_URI, PORT}