const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/User')
const { hash } = require('bcryptjs')
const userController = require('../controllers/userController')
const { verifyUser } = require('../middlewares/auth')

router.post('/register', (req, res, next) => {
    // res.json('success')
    const { username, password, fullname, email, role } = req.body
    User.findOne({ username: username })
        .then((user) => {
            if (user) return res.status(400).json({ error: 'duplicate user' })
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) return res.status(500).json({ error: err.message })
                User.create({ username, password: hash, fullname, role, email })
                    .then((user) => {
                        res.status(201).json(user)
                    }).catch(next)
            })
        }).catch(next)

})

router.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (!user) return res.status(400).json({ error: 'user is not registered' })
            bcrypt.compare(req.body.password, user.password, (err, success) => {
                if (err) return res.status(500).json({ error: err.message })
                if (!success) return res.status(400).json({ error: 'password does not match' })
                const payload = {
                    id: user.id,
                    username: user.username,
                    fullname: user.fullname,
                    role: user.role
                }
                jwt.sign(payload,
                    process.env.SECRET,
                    { expiresIn: '30d' },
                    (err, token) => {
                        if (err) return res.status(500).json({ error: err.message })
                        res.json({ status: 'success', token: token })
                    })
            })
        }).catch(next)
})

router.route('/userinfo')
    .get(verifyUser, userController.getUserById)
    .post((req, res) => {
        res.status(405).json({ error: 'POST request is not allowed' })
    })
    .put(verifyUser, userController.updateUserById)
//.delete(verifyUser, userController.deleteUserById)
module.exports = router