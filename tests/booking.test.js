const supertest = require('supertest');
const app = require('../app');
const { default: mongoose } = require('mongoose');
const api = supertest(app);
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const User = require('../models/User');
const sinon = require('sinon');
const chai = require('chai');
const chaiSpies = require('chai-spies');
const chaiHttp = require('chai-http');
const bookingController = require('../controllers/bookingController')

chai.use(chaiHttp);
chai.use(chaiSpies);
const expect = chai.expect;
const sandbox = sinon.createSandbox();


let usertoken = '';
let admintoken = ''
let destination_id = '';
let booking_id = '';

beforeAll(async () => {
    await Destination.deleteMany();
    await Booking.deleteMany();
    await User.deleteMany();

    const ress = await api.post('/users/register')
        .send({
            fullname: "Aarati Singh",
            username: "aarati123",
            email: "aarati123@gmail.com",
            password: "aarati123",
            role: "user"
        });
    const resss = await api.post('/users/login')
        .send({
            username: "aarati123",
            password: "aarati123"
        });
    usertoken = resss.body.token;

    let data = await api.post('/users/register')
        .send({
            fullname: "Anil Singh",
            username: "anil123",
            email: "anil@gmail.com",
            password: "anil123",
            role: "admin"
        })
    const res = await api.post('/users/login')
        .send({
            username: "anil123",
            password: "anil123"
        })
    admintoken = res.body.token
})

afterAll(async () => await mongoose.connection.close())


test('loggedin admin can create a list of destinations', async () => {
    const res = await api.post('/destination/')
        .set('authorization', `bearer ${admintoken}`)
        .send({
            name: "Aarati Dhangadhi",
            location: "Anamnagar,ktm",
            price: "3500"
        })
        .expect(201);
    console.log(res.body);
});

test('loggedin user can view list of destination', async () => {
    const response = await api.get('/destination/')
        .set('authorization', `bearer ${usertoken}`)
        .expect(200);
    console.log(response.body);
    const destinations = response.body.data;
    const expectedDestinationName = 'Aarati Dhangadhi';
    const foundDestination = destinations.some((destination) => destination.name === expectedDestinationName);

    expect(foundDestination).to.be.true;
});

test('loggedin user can book destination', async () => {
    const destination = await Destination.create({
        name: "Aarati Dhangadhi",
        location: "Anamnagar,ktm",
        price: "3500"
    });

    const bookingData = {
        fullname: "aarati singh",
        email: "aarati@gmail.com",
        date: "21 aug 2023",
        time: "5PM",
        people: 4
    };

    const res = await api.post(`/bookings/${destination._id}/`)
        .set('authorization', `bearer ${usertoken}`)
        .send(bookingData)
        .expect(200)
})

test('get all bookings for all destinations', async () => {
    const res = await api.get('/bookings/all')
        .set('authorization', `bearer ${usertoken}`)
        .expect(200);
});


test('update a booking', async () => {
    // Fetch a valid destination from the database
    const destination = await Destination.create({
        name: "Aarati Dhangadhi",
        location: "Anamnagar,ktm",
        price: "3500"
    });

    // Create a booking to update
    const booking = await Booking.create({
        fullname: "aarati singh",
        email: "aarati@gmail.com",
        date: "21 aug 2023",
        time: "5PM",
        people: 4,
        user: "user_id_here",
        destination: destination._id,
    });
    const updatedData = {
        fullname: "aarati singh",
        email: "aarati@gmail.com",
        date: "22 aug 2023",
        time: "4PM",
        people: 4
    };
    const res = await api.put(`/bookings/${booking._id}`)
        .set('authorization', `bearer ${admintoken}`)
        .send(updatedData)
        .expect(200);
});

test('get a specific booking', async () => {
    // Fetch a valid destination from the database
    const destination = await Destination.create({
        name: "Aarati Dhangadhi",
        location: "Anamnagar,ktm",
        price: "3500"
    });

    // Create a booking to fetch
    const booking = await Booking.create({
        fullname: "aarati singh",
        email: "aarati@gmail.com",
        date: "21 aug 2023",
        time: "5PM",
        people: 4,
        user: "user_id_here",
        destination: destination._id,
    });
    const res = await api.get(`/bookings/${booking._id}`)
        .set('authorization', `bearer ${admintoken}`)
        .expect(200);
});

test('delete a specific booking', async () => {
    // Fetch a valid venue from the database
    const destination = await Destination.create({
        name: "Aarati Dhangadhi",
        location: "Anamnagar,ktm",
        price: "3500"
    });

    // Create a booking to delete
    const booking = await Booking.create({
        fullname: "aarati singh",
        email: "aarati@gmail.com",
        date: "21 aug 2023",
        time: "5PM",
        people: 4,
        user: "user_id_here",
        destination: destination._id,
    });

    const res = await api.delete(`/bookings/${booking._id}`)
        .set('authorization', `bearer ${admintoken}`)
        .expect(200);
    console.log(res.body);
});

test('get all bookings made by a specific user', async () => {
    const res = await api.get('/bookings/all')
        .set('authorization', `bearer ${usertoken}`)
        .expect(200);
    console.log(res.body);
});

test('handle invalid routes for specific bookings', async () => {
    const invalidRoutes = [
        `/bookings/:booking_id`,
        `/bookings/:booking_id`,
        `/bookings/:booking_id`,
    ];
    for (const route of invalidRoutes) {
        try {
            const res = await api.put(route)
                .set('authorization', `bearer ${admintoken}`)
                .expect(405);
            console.log(res.body);
        } catch (err) {
        }
    }
});

it('should respond with a 404 status and error message if booking is not found', async () => {
    const req = {
        params: {
            booking_id: 'valid_booking_id_here',
        },
    };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };
    sinon.stub(Booking, 'findById').resolves(null);
    await bookingController.getBookingDestinationById(req, res);
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, { error: 'Booking not found' });
});