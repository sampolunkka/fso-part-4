const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
})

blogsRouter.post('/', async (request, response, next) => {
    const blog = new Blog(request.body)

    blog.save()
        .then(savedBlog => {
            response.status(201).json(savedBlog)
        })
        .catch(error => next(error))
})

blogsRouter.delete('/:id', async (request, response, next) => {
    Blog.deleteOne({ _id: request.params.id })
        .then((result) => {
            if (result.deletedCount === 0) {
                return response.status(404).json({ error: 'Blog not found' })
            }
            response.status(204).end()
        })
        .catch(error => next(error))
})

module.exports = blogsRouter