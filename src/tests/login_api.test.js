const {test, after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const api = supertest(app)
const helper = require('./testutils/test_helper')

beforeEach(async () => {
    await helper.initDatabase()
})

describe('given login request', () => {
    test('when correct credentials then success', async () => {
        const request = {
            username: helper.initialUserDetails.username,
            password: helper.initialUserDetails.password,
        }

        const response = await api
            .post('/api/login')
            .send(request)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.ok(response.body.token)
    })

    test('when invalid login credentials then unauthorized', async () => {
        const request = {
            username: helper.initialUserDetails.username,
            password: 'wrongpassword',
        }

        const response = await api
            .post('/api/login')
            .send(request)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.error, 'invalid username or password')
    })
})

after(async () => {
    await mongoose.connection.close()
})