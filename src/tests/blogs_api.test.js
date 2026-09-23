const {test, after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const api = supertest(app)
const Blog = require('../model/blog')

const initialBlogs = [
    {
        title: 'Blog 1',
        author: 'Author 1',
        likes: 1,
        url: 'url',
    },
    {
        title: 'Blog 2',
        content: 'Author 2',
        likes: 2,
        url: 'url',
    },
]

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

test('when get blog by id then the correct blog is returned', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToView = blogsAtStart[0]

    const response = await api.get(`/api/blogs/${blogToView.id}`)
    assert.strictEqual(response.body.title, blogToView.title)
})

after(async () => {
    await mongoose.connection.close()
})