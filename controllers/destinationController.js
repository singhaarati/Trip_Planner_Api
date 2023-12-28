
const Destination = require('../models/Destination');

// Get all destinations
const getAllDestinations = (req, res, next) => {
  Destination.find()
    .then(Destinations => res.json({
      success: true,
      count: Destinations.length,
      data: Destinations
    }))
    .catch(next)
}

// Get destination by ID

const getDestinationById = (req, res, next) => {
  Destination.findById(req.params.Destination_id)
    .then((Destination) => {
      if (!Destination) {
        let err = new Error('Destination not found')
        res.status(404).json({ error: 'Destination not found' })
      }
      res.json({
        success: true,
        data: Destination
      })
    })
    .catch(next)
}


// Add a new destination

const createDestination = (req, res, next) => {
  Destination.create(req.body)
    .then((Destination) => res.status(201).json(Destination))
    .catch(err => next(err))
}

const deleteAllDestinations = ((req, res, next) => {
  Destination.deleteMany()
    .then(reply => res.json(reply))
    .catch(next)
})


// Update destination by ID

const updateDestinationById = (req, res, next) => {
  Destination.findByIdAndUpdate(
    req.params.Destination_id,
    { $set: req.body },
    { new: true }
  ).then(updated => res.json(updated))
    .catch(next)
}


// Delete destination by ID

const deleteDestinationById = (req, res, next) => {
  Destination.findByIdAndDelete(req.params.Destination_id)
    .then(reply => res.json(reply))
    .catch(next)
}

// Export the controller functions
module.exports = {
  getAllDestinations,
  deleteAllDestinations,
  getDestinationById,
  createDestination,
  updateDestinationById,
  deleteDestinationById,
};
