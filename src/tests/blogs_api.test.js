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

test('when get blogs then all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('when post blogs then success', async () => {
    const newBlog = {
        title: 'Blog 3',
        author: 'Author 3',
        url: 'url',
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    assert.strictEqual(response.body.title, newBlog.title)
    assert.strictEqual(response.body.author, newBlog.author)
    assert.strictEqual(response.body.url, newBlog.url)
    assert.ok(response.body.id)

    const notesAtEnd = await helper.notesInDb()
    assert.strictEqual(notesAtEnd.length, initialBlogs.length + 1)
})

test('given no title when post blogs then error', async () => {
    const newBlog = {
        author: 'Author 3',
        url: 'url',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const notesAtEnd = await helper.notesInDb()
    assert.strictEqual(notesAtEnd.length, initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})