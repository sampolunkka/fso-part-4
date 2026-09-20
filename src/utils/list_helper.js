const _ = require('lodash')

const dummy = (blogs) => {
    console.log(blogs)
    return 1
}

const totalLikes = (blogs) => {
    if (!blogs.length) {
        return 0
    }
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
    if (!blogs.length) {
        return undefined
    }
    const counts = _.countBy(blogs, 'author')
    const [author, count] = _.maxBy(_.toPairs(counts), 1)

    return {author, blogs: count}
}

const mostLikes = (blogs) => {
    if (!blogs.length) {
        return undefined
    }
    return _(blogs)
        .groupBy('author')
        .map((blogs, author) => ({
            author,
            likes: _.sumBy(blogs, 'likes')
        }))
        .maxBy('likes')
}

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes}