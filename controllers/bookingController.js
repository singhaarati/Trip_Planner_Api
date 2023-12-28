const Booking = require('../models/Booking')
const Destination = require('../models/Destination')

const getAllBookings = (req, res, next) => {
    Booking.find({
        user: req.user.id
    })
        .then(booking => {
            res.json({
                success: true,
                count: booking.length,
                data: booking,
            })
        })
        .catch(err => next(err));
}

const createBookingDestinationById = (req, res) => {
    Destination.findById(req.params.Destination_id)
        .then((destination) => {
            if (!destination) return res.status(404).json({ error: " destination not found" })
            const user_id = req.user.id;
            console.log(req.user)
            console.log(req.body)
            const newBooking = {
                fullname: req.body.fullname,
                email: req.body.email,
                date: req.body.date,
                time: req.body.time,
                price: req.body.price,
                people: req.body.people,
                user: user_id,
                destination: req.params.Destination_id,
                userName: req.user.username
            }
            Booking.create(newBooking)
                .then(successBooking => {
                    res.json({
                        success: true,
                        data: successBooking
                    });
                })
                .catch(err => res.status(500).json({ error: err.message }));
        })
        .catch(err => res.status(500).json({ error: err.message }))
}


const getBookingDestinationById = (req, res) => {
    const bookingId = req.params.booking_id;
    Booking.findById(bookingId)
        .then(booking => {
            if (!booking) {
                return res.status(404).json({ error: "Booking not found" });
            }
            res.json({
                success: true,
                data: [booking]
            });
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

const updateBookingDestinationById = (req, res) => {
    const bookingId = req.params.booking_id;
    Booking.findByIdAndUpdate(bookingId, req.body, { new: true })
        .then(updatedBooking => {
            if (!updatedBooking) {
                return res.status(404).json({ error: "Booking not found" });
            }
            res.json({
                success: true,
                data: [updatedBooking]
            });
        })
        .catch(err => res.status(500).json({ error: err.message }));
}


const deleteBookingDestinationById = (req, res) => {
    const bookingId = req.params.booking_id;
    Booking.findByIdAndDelete(bookingId)
        .then(deletedBooking => {
            if (!deletedBooking) {
                return res.status(404).json({ error: "Booking not found" });
            }
            res.json({
                success: true,
                data: [deletedBooking]
            });
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

module.exports = {
    getAllBookings,
    createBookingDestinationById,
    getBookingDestinationById,
    updateBookingDestinationById,
    deleteBookingDestinationById
}
