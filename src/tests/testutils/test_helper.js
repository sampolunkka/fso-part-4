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

module.exports = { initialBlogs, notesInDb}