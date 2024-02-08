const _ = require('lodash')
const User = require('../models/user')

const blogForPost = {
  title: 'blogForPost',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5
}

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const blogs = [
  {
    user: {
      name: 'test user',
      username: 'user',
      id: '65be50a4078a64914365ec33'
    },
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    user: {
      name: 'test user',
      username: 'user',
      id: '65be50a4078a64914365ec33'
    },
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    user: {
      name: 'test user',
      username: 'user',
      id: '65be50a4078a64914365ec33'
    },
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    user: {
      name: 'test user',
      username: 'user',
      id: '65be50a4078a64914365ec33'
    },
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    user: {
      name: 'test user',
      username: 'user',
      id: '65be50a4078a64914365ec33'
    },
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    user: {
      name: 'test user',
      username: 'user',
      id: '65be50a4078a64914365ec33'
    },
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogArray) => {
  return blogArray.reduce((accumulator, currentValue) => accumulator + currentValue.likes, 0)
}

const favouriteBlog = (blogArray) => {
  const blog = blogArray.reduce((maxLikesBlog, currentBlog) => {
    return currentBlog.likes > maxLikesBlog.likes ? currentBlog : maxLikesBlog
  }, blogArray[0])
  return blog
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, 'author')
  const authorWithMostBlogs = _.maxBy(Object.keys(blogsByAuthor), author => blogsByAuthor[author].length)
  const count = blogsByAuthor[authorWithMostBlogs].length
  return { author: authorWithMostBlogs, blogs: count }
}

const mostLikes = (blogs) => {
  const blogWithMostLikes = _.maxBy(blogs, blog => blog.likes)
  return { author: blogWithMostLikes.author, likes: blogWithMostLikes.likes }
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
  listWithOneBlog,
  blogs,
  blogForPost,
  usersInDb
}
