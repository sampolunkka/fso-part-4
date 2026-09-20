const {test, describe} = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

const testBlogs = [
    {title: 'Blog 1', author: 'Author 1', likes: 1},
    {title: 'Blog 2', author: 'Author 2', likes: 2},
    {title: 'Blog 3', author: 'Author 3', likes: 3},
]

describe('total likes', () => {
    test('when multiple elements then returns the total number of likes', () => {
        const expectedLikes = 6
        const result = listHelper.totalLikes(testBlogs)
        assert.strictEqual(result, expectedLikes)
    })

    test('when single element then returns likes for that element', () => {
        const result = listHelper.totalLikes([testBlogs[0]])
        assert.strictEqual(result, 1)
    })

    test('when empty list then returns 0', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })
})

describe('favourite blog', () => {
    test('when multiple entries then returns most liked element', () => {
        const result = listHelper.favoriteBlog(testBlogs)
        assert.deepStrictEqual(result, testBlogs[2])
    })

    test('when single entry then returns that element', () => {
        const result = listHelper.favoriteBlog([testBlogs[0]])
        assert.deepStrictEqual(result, testBlogs[0])
    })

    test('when empty list then returns undefined', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, undefined)
    })

    test('when multiple entries tied for most likes then returns first found', () => {
        const blogs = [...testBlogs, {title: 'Blog 4', author: 'Author 4', likes: 3}]
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, blogs[2])
    })
})

describe('most blogs', () => {
    test('when duplicate authors then returns author with most blogs ', () => {
        const blogs = [...testBlogs, {title: 'Blog 4', author: 'Author 1', likes: 4}]
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, {author: 'Author 1', blogs: 2})
    })

    test('when all unique authors then returns first author ', () => {
        const result = listHelper.mostBlogs(testBlogs)
        assert.deepStrictEqual(result, {author: 'Author 1', blogs: 1})
    })

    test('when single author then returns that author', () => {
        const result = listHelper.mostBlogs([testBlogs[0]])
        assert.deepStrictEqual(result, {author: 'Author 1', blogs: 1})
    })

    test('when empty list then returns undefined', () => {
        const result = listHelper.mostBlogs([])
        assert.strictEqual(result, undefined)
    })
})

describe('most likes', () => {
    test('when duplicate authors then returns most common author ', () => {
        const blogs = [...testBlogs, {title: 'Blog 4', author: 'Author 1', likes: 4}]
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result, {author: 'Author 1', likes: 5})
    })

    test('when all unique authors then returns most liked author ', () => {
        const result = listHelper.mostLikes(testBlogs)
        assert.deepStrictEqual(result, {author: 'Author 3', likes: 3})
    })

    test('when single element then returns most liked author ', () => {
        const result = listHelper.mostLikes([testBlogs[0]])
        assert.deepStrictEqual(result, {author: 'Author 1', likes: 1})
    })
})