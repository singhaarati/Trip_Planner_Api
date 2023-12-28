const mongoose = require('mongoose')

const bookingDestinationSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true,

    },
    people: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userName: {
        type: String
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination'
    }
})

//remove unnessary thing
bookingDestinationSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = document._id.toString()
        delete returnedDocument._id
        delete returnedDocument.__v
    }
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingDestinationSchema)