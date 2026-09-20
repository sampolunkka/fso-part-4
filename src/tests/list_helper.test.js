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
    test('returns the total number of likes for multiple elements', () => {
        const expectedLikes = 6
        const result = listHelper.totalLikes(testBlogs)
        assert.strictEqual(result, expectedLikes)
    })

    test('returns the likes for single element', () => {
        const result = listHelper.totalLikes([testBlogs[0]])
        assert.strictEqual(result, 1)
    })

    test('returns 0 for an empty list', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })
})

describe('favourite blog', () => {
    test('returns most liked element', () => {
        const result = listHelper.favoriteBlog(testBlogs)
        assert.deepStrictEqual(result, testBlogs[2])
    })

    test('returns first element for single element', () => {
        const result = listHelper.favoriteBlog([testBlogs[0]])
        assert.deepStrictEqual(result, testBlogs[0])
    })

    test('returns undefined for an empty list', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, undefined)
    })

    test('returns former element for multiple elements with same likes', () => {
        const blogs = [...testBlogs, {title: 'Blog 4', author: 'Author 4', likes: 3}]
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, blogs[2])
    })
})

describe('most blogs', () => {
    test('returns most common author ', () => {
        const blogs = [...testBlogs, {title: 'Blog 4', author: 'Author 1', likes: 4}]
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, {author: 'Author 1', blogs: 2})
    })

    test('returns first author for single element', () => {
        const result = listHelper.mostBlogs([testBlogs[0]])
        assert.deepStrictEqual(result, {author: 'Author 1', blogs: 1})
    })

    test('returns undefined for an empty list', () => {
        const result = listHelper.mostBlogs([])
        assert.strictEqual(result, undefined)
    })
})