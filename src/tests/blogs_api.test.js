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
    let BlogObject = new Blog(initialBlogs[0])
    await BlogObject.save()
    BlogObject = new Blog(initialBlogs[1])
    await BlogObject.save()
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

    const resultingBlogs = await helper.notesInDb()
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

    const resultingBlogs = await helper.notesInDb()
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

    const resultingBlogs = await helper.notesInDb()
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
        .expect('Content-Type', /application\/json/)
})

test('given valid id when delete blog then success', async () => {
    const initialBlogsInDb = await helper.notesInDb()
    const id = initialBlogsInDb[0].id

    await api
        .delete(`/api/blogs/${id}`)
        .expect(204)

    const resultingBlogs = await helper.notesInDb()
    assert.ok(resultingBlogs.length === initialBlogsInDb.length - 1)
    assert.ok(!resultingBlogs.find(blog => blog.id === id))
})

test('given invalid id when delete blog then not found', async () => {
    const invalidId = await helper.nonExistingId()

    await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(404)
})

after(async () => {
    await mongoose.connection.close()
})