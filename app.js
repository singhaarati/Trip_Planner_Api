require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const morgan = require('morgan')
const destination = require('./routes/destination_routes')
const user_routes = require('./routes/user_routes')
const booking_routes = require('./routes/booking_routes')
const upload = require('./middlewares/upload')
const { verifyUser } = require('./middlewares/auth');
const booking = require('./models/Booking');
const Destination = require('./models/Destination');


const MONGODB_URL = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URL
    : process.env.DB_URL

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log(`connected to ${MONGODB_URL} database server`)
    })
    .catch((err) => console.log(err))

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(morgan('tiny'))

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.use('/users', user_routes)
app.use('/bookings', verifyUser, booking_routes)
app.use('/destination', verifyUser, destination)

// app.post('/upload/:Destination_id', upload.single('photo'), (req, res, next) => {
//     Destination.findOneAndUpdate({
//         _id: req.params.Destination_id
//     },
//         { $set: { picture: `${req.file.filename}` } },
//         { new: true }
//     )
//         .then(destination => {
//             res.json(req.file)
//         })
//         .catch(err => next(err))
// })


app.post('/upload', upload.single('photo'), (req, res, next) => {
    console.log(req.file)
    res.json({ data: req.file.filename})
})

// app.post('/upload/', upload.single('photo'), (req, res, next) => {
//     res.json({ data: req.file.filename })
// })

module.exports = app