const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const {userExtractor, tokenExtractor} = require('../utils/middleware')


blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
            .populate('user', {username: 1, name: 1, id: 1})
        response.json(blogs)
    } catch (error) {
        next(error)
    }
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response, next) => {
    try {
        const user = request.user
        const blog = new Blog(request.body)
        blog.user = user._id
        const savedBlog = await blog.save()

        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        await savedBlog.populate('user', {username: 1, name: 1, id: 1})

        response.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({error: 'Blog not found'})
    }

    const user = request.user
    if (blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({error: 'Insufficient credentials'})
    }

    try {
        await Blog.deleteOne({_id: request.params.id})
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogsRouter.patch('/:id', async (request, response, next) => {
    if (!request.body.likes) {
        return response.status(400).json({error: 'Likes field is required'})
    }

    try {
        const blog = await Blog.findById(request.params.id)

        if (!blog) {
            return response.status(404).json({error: 'Blog not found'})
        }

        blog.likes = request.body.likes
        const updatedBlog = await blog.save()

        response.json(updatedBlog)
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter