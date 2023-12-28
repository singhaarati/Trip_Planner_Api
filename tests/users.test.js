const supertest = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const api = supertest(app)

const User = require('../models/User')

beforeAll(async () => {
  await User.deleteMany({})
})

///register

test('user registration', async () => {
  const res = await api.post('/users/register')
    .send({
      username: "aarati123",
      password: "aarati123",
      fullname: "Aarati Singh",
      email: "aarati@gmail.com"
    })
    .expect(201)
  console.log(res.body)
  expect(res.body.username).toBe("aarati123")
})

test('registration of duplicate email', () => {
  return api.post('/users/register')
    .send({
      username: "aarati123",
      password: "aarati123",
      fullname: "Aarati Singh",
      email: "aarati@gmail.com"
    }).expect(400)
    .then((res) => {
      console.log(res.body)
      expect(res.body.error).toMatch(/duplicate user/)
    })
})

test('POST request to the /register endpoint with valid user registration data', async () => {
  const res = await api.post('/users/register')
    .send({
      username: 'testUser',
      password: 'testPassword',
      fullname: 'Test User',
      email: 'test@example.com'
    })
    .expect(201);

  expect(res.status).toBe(201);

  const user = await User.findOne({ username: 'testUser' });
  expect(user).toBeDefined();
  expect(user.username).toBe('testUser');
  expect(user.fullname).toBe('Test User');
  expect(user.email).toBe('test@example.com');
});

test('registration with weak password', async () => {
  const res = await api.post('/users/register')
    .send({
      username: 'testUser12',
      password: 'weakpass',
      fullname: 'Test User',
      email: 'test@example.com'
    })
    .expect(500);

  expect(res.status).toBe(500);
  // expect(res.body.error).toMatch(/password strength requirements/);
});




///login

test('registered user can login', async () => {
  const res = await api.post('/users/login')
    .send({
      username: "aarati123",
      password: "aarati123"
    })
    .expect(200)
  console.log(res.body)
  expect(res.body.token).toBeDefined()
})


test('user login with unregistered username', async () => {
  const res = await api.post('/users/login')
    .send({
      username: "testUser1",
      password: "test123"
    })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toMatch(/user is not registered/)
    })
})

test('user password does not match', async () => {
  const res = await api.post('/users/login')
    .send({
      username: "aarati123",
      password: "aarati12345"
    })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toMatch(/password does not match/)
    })
})


test('user password change', async () => {
  const loginRes = await api.post('/users/login')
    .send({
      username: 'aarati123',
      password: 'aarati123'
    })
    .expect(200);
  const { token } = loginRes.body;

  const changePasswordRes = await api.post('/users/change-password')
    .set('Authorization', `Bearer ${token}`)
    .send({
      currentPassword: 'aarati123',
      newPassword: 'newPassword'
    })
    .expect(404);
  expect(changePasswordRes.status).toBe(404);
});

test('successful user registration', async () => {
  const res = await api.post('/users/register')
    .send({
      username: 'newUser123',
      password: 'newPassword123',
      fullname: 'New User',
      email: 'newuser@example.com'
    })
    .expect(201);

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body.username).toBe('newUser123');
  expect(res.body.fullname).toBe('New User');
  expect(res.body.email).toBe('newuser@example.com');
});

test('user login with incorrect username', async () => {
  const res = await api.post('/users/login')
    .send({
      username: 'nonExistentUser',
      password: 'somePassword'
    })
    .expect(400);

  expect(res.body).toHaveProperty('error', 'user is not registered');
});


test('user login with incorrect password', async () => {
  const res = await api.post('/users/login')
    .send({
      username: 'aarati123',
      password: 'incorrectPassword'
    })
    .expect(400);

  expect(res.body).toHaveProperty('error', 'password does not match');
});

test('user registration with missing fields', async () => {
  const res = await api.post('/users/register')
    .send({
    })
    .expect(500);

  expect(res.body).toHaveProperty('error');
});


test('user registration with duplicate username', async () => {
  const res = await api.post('/users/register')
    .send({
      username: 'aarati123',
      password: 'newPassword123',
      fullname: 'New User',
      email: 'newuser@example.com'
    })
    .expect(400);

  expect(res.body).toHaveProperty('error', 'duplicate user');
});

test('user password change with incorrect or missing token', async () => {
  const res = await api.post('/users/change-password')
    .set('Authorization', `Bearer invalidToken`)
    .send({
      currentPassword: 'aarati123',
      newPassword: 'newPassword123'
    });

  expect(res.status).toBe(404);
});

afterAll(async () => await mongoose.connection.close())