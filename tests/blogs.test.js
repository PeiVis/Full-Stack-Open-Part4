const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const listHelper = require('../utils/list_helper')

const bcrypt = require('bcrypt')
const User = require('../models/user')

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  const noteObjects = listHelper.blogs
    .map(note => new Blog(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'name', passwordHash })

  await user.save()
  const login = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)

  token = login.body.token
})

test('check request lenght', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body).toHaveLength(listHelper.blogs.length)
}, 100000)

test('correct id format on blogs', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
}, 100000)

test('post a new blog and check for lenght of response', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token)
    .send(listHelper.blogForPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body).toHaveLength(listHelper.blogs.length + 1)
}, 100000)

test('post a new blog with no likes, expect likes to be defined and === 0', async () => {
  const blogWithoutLikes = structuredClone(listHelper.blogForPost)
  delete blogWithoutLikes.likes
  const blog = await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token)
    .send(blogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs/' + blog.body.id)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBeDefined()
  expect(response.body.likes === 0)
}, 100000)

test('delete blog', async () => {
  const blog = await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token)
    .send(listHelper.blogForPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  await api
    .get('/api/blogs/' + blog.body.id)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  await api
    .delete('/api/blogs/' + blog.body.id)
    .set('Authorization', 'Bearer ' + token)
    .expect(204)
  await api
    .get('/api/blogs/' + blog.body.id)
    .expect(400)
}, 100000)

test('put blog', async () => {
  const blog = await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token)
    .send(listHelper.blogForPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  await api
    .put('/api/blogs/' + blog.body.id)
    .send({ title: 'New Ttile' })
    .expect(204)
  const response = await api
    .get('/api/blogs/' + blog.body.id)
    .expect(200)
  expect(response.body.title).toBe('New Ttile')
}, 100000)

test('post a new blog with no url, ecpects to throw 400', async () => {
  const blogWithoutUrl = structuredClone(listHelper.blogForPost)
  delete blogWithoutUrl.url

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token)
    .send(blogWithoutUrl)
    .expect(400)
}, 100000)

test('post a new blog with no title, ecpects to throw 400', async () => {
  const blogWithoutTitle = structuredClone(listHelper.blogForPost)
  delete blogWithoutTitle.title

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token)
    .send(blogWithoutTitle)
    .expect(400)
}, 100000)

test('post a new blog with no token expect 401', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + '')
    .send(listHelper.blogForPost)
    .expect(401)
    .expect('Content-Type', /application\/json/)
}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})
