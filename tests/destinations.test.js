const supertest = require('supertest');
const app = require('../app');
const { default: mongoose } = require('mongoose');
const api = supertest(app);
const User = require('../models/User');
const Destination = require('../models/Destination');
const Review = require('../models/Destination')

let usertoken = '';
let admintoken = '';
let destination_id = '';
let review_id = '';

beforeAll(async () => {
    await Destination.deleteMany();
    await User.deleteMany();

    const ress = await api.post('/users/register').send({
        fullname: "Aarati Singh",
        username: "aarati123",
        email: "aarati123@gmail.com",
        password: "aarati123",
        role: "user"
    });
    const resss = await api.post('/users/login').send({
        username: "aarati123",
        password: "aarati123"
    });
    usertoken = resss.body.token;
    const data = await api.post('/users/register').send({
        fullname: "Anil Singh",
        username: "anil123",
        email: "anil@gmail.com",
        password: "anil123",
        role: "admin"
    });
    const res = await api.post('/users/login').send({
        username: "anil123",
        password: "anil123"
    });
    admintoken = res.body.token;
});

afterAll(async () => await mongoose.connection.close());

test('loggedin admin can create a list of destinations', async () => {
    const res = await api.post('/destination/')
        .set('authorization', `bearer ${admintoken}`)
        .send({
            name: "Pokhara PhewaTal",
            location: "Anamnagar,ktm",
            price: "3500"
        })
        .expect(201);
    console.log(res.body);
});

test('loggedin user cannot create  list of venues', async () => {
    const res = await api.post('/destination/')
        .set('authorization', `bearer ${usertoken}`)
        .send({
            name: "Pokhara PhewaTal",
            location: "Anamnagar,ktm",
            price: "3500"
        })
        .expect(403)
    expect(res.body.error).toMatch(/you are not admin!/)
})

test('loggedin user can view list of destination', async () => {
    const response = await api.get('/destination')
        .set('authorization', `bearer ${usertoken}`)
        .expect(200);
    console.log(response.body);
    const destinations = response.body.data;
    const expectedDestinationName = 'Pokhara PhewaTal';
    const foundDestination = destinations.some((destination) =>
        destination.name === expectedDestinationName);
    expect(foundDestination).toBe(true);
});

test('loggedin user can get destination by id', async () => {
    const res = await api.get(`/destination/${destination_id}`)
        .set('authorization', `bearer ${usertoken}`)
        .expect(200)
    console.log(res.body)
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(destination_id.destinationName);
})

test('loggedin user can  create review on any destination', async () => {
    const res = await api.post(`/destination/${destination_id}/reviews`)
        .set('authorization', `bearer ${usertoken}`)
        .send({
            text: "this destination is so good"
        })
    // .expect(404)
    console.log(res.body)
})



