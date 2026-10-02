const Blog = require('../../models/blog')

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

const notesInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
    const blog = new Blog({title: 'willremovethissoon', url: 'url', author: 'Author'})
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

module.exports = {initialBlogs, notesInDb, nonExistingId}