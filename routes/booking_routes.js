const express = require('express')
const router = express.Router()
const destinationController = require('../controllers/destinationController')
const bookingDestinationController = require('../controllers/bookingController')
const Destination = require('../models/Destination')
const Booking = require('../models/Booking')
const { verifyUser } = require('../middlewares/auth')

//booking
router.route('/')
    // .get(bookingDestinationController.getABookingDestination)
    // .post(bookingDestinationController.createBookingDestination)
    .put((req, res) => {
        res.status(405).json({ error: "PUT request is not allowed" })
    })


// only by user
router.route('/all')
    .get(verifyUser, bookingDestinationController.getAllBookings)

router.route('/:Destination_id')
    .post(verifyUser, bookingDestinationController.createBookingDestinationById)

router.route('/:booking_id')
    .get(bookingDestinationController.getBookingDestinationById)
    .put(bookingDestinationController.updateBookingDestinationById)
    .delete(bookingDestinationController.deleteBookingDestinationById)

module.exports = router