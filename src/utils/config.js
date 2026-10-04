require('dotenv').config()

const TEST = 'test'

const PORT = process.env.PORT

function getEnvUri() {
    const env = process.env.NODE_ENV
    switch (env) {
        case TEST:
            return process.env.TEST_MONGODB_URI
        default:
            return process.env.MONGODB_URI
    }
}

const MONGODB_URI = getEnvUri()

module.exports = {MONGODB_URI, PORT}