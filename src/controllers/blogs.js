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
    Blog.deleteOne({_id: request.params.id})
        .then((result) => {
            if (result.deletedCount === 0) {
                return response.status(404).end()
            }
            response.status(204).end()
        })
        .catch(error => next(error))
})

blogsRouter.patch('/:id', async (request, response, next) => {
    if (!request.body.likes) {
        return response.status(400).end()
    }

    Blog.findById(request.params.id)
        .then(blog => {
            if (!blog) {
                return response.status(404).end()
            }
            blog.likes = request.body.likes
            return blog.save().then(updatedBlog => {
                response.json(updatedBlog)
            })
        })
        .catch(error => next(error))
})

module.exports = blogsRouter