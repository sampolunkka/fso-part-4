const {test, after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./testutils/test_helper')

const initialBlogs = helper.initialBlogs

beforeEach(async () => {
    await Blog.deleteMany({})
    for (const blog of initialBlogs) {
        await new Blog(blog).save()
    }
})

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

test('when post blogs then success', async () => {
    const request = {
        title: 'Blog 3',
        author: 'Author 3',
        url: 'url',
    }

    const response = await api
        .post('/api/blogs')
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

test('given no title when post blogs then error', async () => {
    const request = {
        author: 'Author 3',
        url: 'url',
    }

    await api
        .post('/api/blogs')
        .send(request)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    const resultingBlogs = await helper.blogsInDb()
    assert.strictEqual(resultingBlogs.length, initialBlogs.length)
})

test('given undefined likes when post blogs then likes defaults to 0', async () => {
    const request = {
        title: 'Blog with undefined likes',
        url: 'url',
    }

    await api
        .post('/api/blogs')
        .send(request)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const resultingBlogs = await helper.blogsInDb()
    const result = resultingBlogs.find(blog => blog.title === request.title)
    assert.ok(result.likes === 0)
})

test('given undefined title when post blogs then bad request', async () => {
    const request = {
        url: 'url',
        author: 'Author',
    }

    await api
        .post('/api/blogs')
        .send(request)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

test('given undefined url when post blogs then bad request', async () => {
    const request = {
        title: 'Blog with undefined url',
        author: 'Author',
    }

    await api
        .post('/api/blogs')
        .send(request)
        .expect(400)
})

test('given valid id when delete blog then success', async () => {
    const blogs = await helper.blogsInDb()
    const id = blogs[0].id

    await api
        .delete(`/api/blogs/${id}`)
        .expect(204)

    const resultingBlogs = await helper.blogsInDb()
    assert.ok(resultingBlogs.length === blogs.length - 1)
    assert.ok(!resultingBlogs.find(blog => blog.id === id))
})

test('given invalid id when delete blog then not found', async () => {
    const invalidId = await helper.nonExistingId()

    await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(404)
})

test('given valid id when patch blog then success', async () => {
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

test('given invalid id when patch blog then not found', async () => {
    const invalidId = await helper.nonExistingId()

    await api
        .patch(`/api/blogs/${invalidId}`)
        .send({likes: 10})
        .expect(404)
})

test('given undefined likes when patch blog then bad request', async () => {
    const blogs = await helper.blogsInDb()
    const id = blogs[0].id

    await api
        .patch(`/api/blogs/${id}`)
        .send({})
        .expect(400)
})

after(async () => {
    await mongoose.connection.close()
})