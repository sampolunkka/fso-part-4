require('dotenv').config()

const PROD = 'prod'
const TEST = 'test'

const PORT = process.env.PORT

function getEnvUri() {
    const env = process.env.NODE_ENV
    switch (env) {
        case TEST:
            return process.env.TEST_MONGODB_URI
        case PROD:
            return process.env.MONGODB_URI
        default:
            throw new Error(`Unknown environment: ${env}`)
    }
}

const MONGODB_URI = getEnvUri()

module.exports = {MONGODB_URI, PORT}