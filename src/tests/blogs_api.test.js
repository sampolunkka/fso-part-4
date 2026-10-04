const {test, after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const api = supertest(app)
const helper = require('./testutils/test_helper')

const initialBlogs = helper.initialBlogs
const userDetails = helper.initialUserDetails


beforeEach(async () => {
    await helper.initDatabase()
})

describe('given get blogs', () => {
    test('when get blogs then success', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, initialBlogs.length)

        response.body.forEach((blog) => {
            assert.ok(blog.id)
            assert.ok(blog.id !== undefined && blog.id !== null)

        })
    })

    test('when get blogs then user linked', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        response.body.forEach((blog) => {
            assert.ok(blog.user)
            assert.ok(blog.user.username === userDetails.username)
            assert.ok(blog.user.name === userDetails.name)
            assert.ok(blog.user.id)
        })
    })
})

describe('given post blogs', () => {
    test('when valid request then success', async () => {
        const token = await helper.getToken(userDetails)

        const request = {
            title: 'Blog 3',
            author: 'Author 3',
            url: 'url',
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(request)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.title, request.title)
        assert.strictEqual(response.body.author, request.author)
        assert.strictEqual(response.body.url, request.url)
        assert.ok(response.body.id)
        assert.ok(response.body.id !== undefined && response.body.id !== null)

        const resultingBlogs = await helper.blogsInDb()
        assert.strictEqual(resultingBlogs.length, initialBlogs.length + 1)
    })

    test('when valid request then user linked', async () => {
        const token = await helper.getToken(userDetails)

        const request = {
            title: 'Linked Blog',
            author: 'Author',
            url: 'url',
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(request)
            .expect(201)

        const user = response.body.user
        assert.ok(user.username === userDetails.username)
        assert.ok(user.name === userDetails.name)
        assert.ok(user.id !== undefined && user.id !== null)
    })

    test('when invalid token then unauthorized', async () => {
        const request = {
            title: 'Blog 3',
            author: 'Author 3',
            url: 'url',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer invalidtoken')
            .send(request)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })

    test('when no title when then bad request', async () => {
        const token = await helper.getToken(userDetails)
        const request = {
            author: 'Author 3',
            url: 'url',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(request)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const resultingBlogs = await helper.blogsInDb()
        assert.strictEqual(resultingBlogs.length, initialBlogs.length)
    })

    test('when undefined likes then success and likes defaults to 0', async () => {
        const token = await helper.getToken(userDetails)
        const request = {
            title: 'Blog with undefined likes',
            url: 'url',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(request)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const resultingBlogs = await helper.blogsInDb()
        const result = resultingBlogs.find(blog => blog.title === request.title)
        assert.ok(result.likes === 0)
    })

    test('when undefined title then bad request', async () => {
        const token = await helper.getToken(userDetails)
        const request = {
            url: 'url',
            author: 'Author',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(request)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('when undefined url then bad request', async () => {
        const token = await helper.getToken(userDetails)
        const request = {
            title: 'Blog with undefined url',
            author: 'Author',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(request)
            .expect(400)
    })
})

describe('given delete blogs', () => {
    test('when valid id then success', async () => {
        const token = await helper.getToken(userDetails)
        const blogs = await helper.blogsInDb()
        const id = blogs[0].id

        await api
            .delete(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const resultingBlogs = await helper.blogsInDb()
        assert.ok(resultingBlogs.length === blogs.length - 1)
        assert.ok(!resultingBlogs.find(blog => blog.id === id))
    })

    test('when invalid blog id then not found', async () => {
        const token = await helper.getToken(userDetails)
        const invalidId = await helper.nonExistingId()

        await api
            .delete(`/api/blogs/${invalidId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
    })

    test('when user not authorized to delete then unauthorized', async () => {
        const userDetails = {
            name: 'unauthorized',
            username: 'unauthorized',
            password: 'unauthorized'
        }

        await helper.addUser(userDetails)
        const token = await helper.getToken(userDetails)
        const blogs = await helper.blogsInDb()
        const id = blogs[0].id

        await api
            .delete(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(403)
            .expect('Content-Type', /application\/json/)
    })

    test('when invalid token then unauthorized', async () => {
        await api
            .delete('/api/blogs/ignored')
            .expect(401)
    })
})

describe('given patch blogs', () => {
    test('when valid id then success', async () => {
        const blogs = await helper.blogsInDb()
        const id = blogs[0].id
        const likes = blogs[0].likes + 1

        const response = await api
            .patch(`/api/blogs/${id}`)
            .send({likes})
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, likes)
    })

    test('when invalid id then not found', async () => {
        const invalidId = await helper.nonExistingId()

        await api
            .patch(`/api/blogs/${invalidId}`)
            .send({likes: 10})
            .expect(404)
    })

    test('when undefined likes then bad request', async () => {
        const blogs = await helper.blogsInDb()
        const id = blogs[0].id

        await api
            .patch(`/api/blogs/${id}`)
            .send({})
            .expect(400)
    })
})

after(async () => {
    await mongoose.connection.close()
})