const Blog = require('../../models/blog')
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../utils/config')

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

const initialUserDetails = {
    username: 'root',
    name: 'Superuser',
    password: 'sekret',
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
    const blog = new Blog({title: 'willremovethissoon', url: 'url', author: 'Author'})
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const initialUsers = async () => {
    const passwordHash = await bcrypt.hash(initialUserDetails.password, 10)
    return [
        {
            username: initialUserDetails.username,
            name: initialUserDetails.name,
            passwordHash
        }
    ]
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const getToken = async (userDetails) => {
    const user = await User.findOne({username: userDetails.username})
    if (!user) {
        throw new Error('User not found')
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    return jwt.sign(userForToken, SECRET)
}

module.exports = {
    initialBlogs,
    initialUsers,
    initialUserDetails,
    blogsInDb,
    nonExistingId,
    usersInDb,
    getToken
}