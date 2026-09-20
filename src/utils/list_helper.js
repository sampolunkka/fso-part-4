const _ = require('lodash')

const dummy = (blogs) => {
    console.log(blogs)
    return 1
}

const totalLikes = (blogs) => {
    let likes = 0
    blogs.forEach(blog => {
        likes += blog.likes
    })
    return likes
}

const favoriteBlog = (blogs) => {
    return _.maxBy(blogs, 'likes')
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }
    const counts = _.countBy(blogs, 'author')
    const [author, count] = _.maxBy(_.toPairs(counts), 1)

    return {author, blogs: count}
}

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs}