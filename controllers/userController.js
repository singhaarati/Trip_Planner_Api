const User = require('../models/User')


const getUserById = (req, res, next) => {
    User.findById(req.user.id)
        .then((user) => {
            if (!user) {
                res.status(404).json({ error: 'user not found' })
            }
            res.json({
                success: true,
                data: [user]
            })
        })
        .catch(next)
}


const updateUserById = (req, res, next) => {
    User.findByIdAndUpdate(
        req.user.id,
        { $set: req.body },
        { new: true }
    ).then(updated => res.json(updated))
        .catch(next)
}

module.exports = {
    getUserById,
    updateUserById
}