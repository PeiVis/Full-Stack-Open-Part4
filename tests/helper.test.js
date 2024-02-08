const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has several listHelper.blogs, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.blogs)
    expect(result).toBe(36)
  })
})

describe('favourite blog', () => {
  test('when list has only one blog, returns itself', () => {
    const result = listHelper.favouriteBlog(listHelper.listWithOneBlog)
    expect(result).toEqual(listHelper.listWithOneBlog[0])
  })

  test('when list has several listHelper.blogs, returns blog with most likes, if several listHelper.blogs with same amount of likes returns one of them', () => {
    const result = listHelper.favouriteBlog(listHelper.blogs)
    expect(result).toEqual(listHelper.blogs[2])
  })
})

describe('Most listHelper.blogs', () => {
  test('when list has only one blog, returns author of said blog', () => {
    const result = listHelper.mostBlogs(listHelper.listWithOneBlog)
    expect(result).toEqual({ author: listHelper.listWithOneBlog[0].author, blogs: 1 })
  })

  test('when list has several listHelper.blogs, returns author with most listHelper.blogs', () => {
    const result = listHelper.mostBlogs(listHelper.blogs)
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('Most likes', () => {
  test('when list has only one blog, returns author and likes of said blog', () => {
    const result = listHelper.mostLikes(listHelper.listWithOneBlog)
    expect(result).toEqual({ author: listHelper.listWithOneBlog[0].author, likes: listHelper.listWithOneBlog[0].likes })
  })

  test('when list has several listHelper.blogs, returns author of the blog with the most likes', () => {
    const result = listHelper.mostLikes(listHelper.blogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 12 })
  })
})
