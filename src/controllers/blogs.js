const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs)
    } catch (error) {
        next(error)
    }
})

blogsRouter.post('/', async (request, response, next) => {
    try {
        const blog = new Blog(request.body)
        const savedBlog = await blog.save()

        response.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const result = await Blog.deleteOne({_id: request.params.id})

        if (result.deletedCount === 0) {
            return response.status(404).end()
        }

        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogsRouter.patch('/:id', async (request, response, next) => {
    if (!request.body.likes) {
        return response.status(400).end()
    }

    try {
        const blog = await Blog.findById(request.params.id)

        if (!blog) {
            return response.status(404).end()
        }

        blog.likes = request.body.likes
        const updatedBlog = await blog.save()

        response.json(updatedBlog)
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter