const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.status(200).json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) response.status(200).json(blog)
  else response.status(400).end()
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: {
      name: user.name,
      username: user.username,
      id: user.id
    }
  })

  if (!blog.likes) {
    blog.likes = 0
  }

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)
  if (!blog) response.status(404).json({ error: 'Blog not found' })
  if (!user) response.status(404).json({ error: 'User not found' })
  if ((blog.user.id).toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
  } else {
    return response.status(401).json({ error: 'User token does not match with user id of blog' })
  }
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = new Blog(request.body)
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    id: request.params.id,
    user: body.user
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).json(blog)
})

module.exports = blogsRouter
