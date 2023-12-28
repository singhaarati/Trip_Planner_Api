const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        minLength: 6,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        // unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

//set JSON method to not to return hashed password

userSchema.set('toJSON', {
    transform: (document, returnDocument) => {
        returnDocument.id = document._id.toString()
        delete returnDocument._id
        delete returnDocument.password
        delete returnDocument.__v
    }
})

module.exports = new mongoose.model('User', userSchema)