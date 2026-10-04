const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const {SECRET} = require('../utils/config')
const jwt = require('jsonwebtoken')

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
        const decodedToken = jwt.verify(request.token, SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }
        const user = await User.findById(decodedToken.id)

        if (!user) {
            return response.status(400).json({ error: 'UserId missing or not valid' })
        }

        const blog = new Blog(request.body)
        blog.user = user._id
        const savedBlog = await blog.save()

        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        await savedBlog.populate('user', { username: 1, name: 1, id: 1})

        response.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const result = await Blog.deleteOne({_id: request.params.id})

        if (result.deletedCount === 0) {
            return response.status(404).json({ error: 'Blog not found' })
        }

        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogsRouter.patch('/:id', async (request, response, next) => {
    if (!request.body.likes) {
        return response.status(400).json({ error: 'Likes field is required' })
    }

    try {
        const blog = await Blog.findById(request.params.id)

        if (!blog) {
            return response.status(404).json({ error: 'Blog not found' })
        }

        blog.likes = request.body.likes
        const updatedBlog = await blog.save()

        response.json(updatedBlog)
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter