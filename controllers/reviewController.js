const Destination = require('../models/Destination');

// Get all reviews

const getAllReviews = (req, res, next) => {
    Destination.findById(req.params.Destination_id)
        .then((destination) => {
            if (!destination) return res.status(404).json({ error: 'destination not found' })
            res.json(destination.reviews)
        }).catch(next)
}

// Create a new review object

const createReview = (req, res, next) => {
    Destination.findById(req.params.Destination_id)
        .then((destination) => {
            if (!destination) return res.status(404).json({ error: 'Destination not found' })
            const review = {
                text: req.body.text,
                user: req.user.id
            }
            destination.reviews.push(review)
            destination.save()
                .then((destination) => res
                    .status(201)
                    .json(destination.reviews[destination.reviews.length - 1]))
                .catch(next)
        }).catch(next)
}

//delete all reviews

const deleteAllReviews = (req, res, next) => {
    Destination.findById(req.params.Destination_id)
        .then((destination) => {
            if (!destination) return res.status(404).json({ error: 'destination not found' })
            destination.reviews = []
            destination.save()
                .then((destination) => res.status(204).end())
                .catch(next)
        }).catch(next)
}

// Get a review by ID

const getReviewById = (req, res, next) => {
    Destination.findById(req.params.Destination_id)
        .then((destination) => {
            if (!destination) return res.status(404).json({ error: 'destination not found' })
            const review = destination.reviews.id(req.params.review_id)
            if (!review) return res.status(404).json({ error: 'review not found' })
            res.json(review)
        }).catch(next)
}


//update a review

const updateReviewById = (req, res, next) => {
    Destination.findById(req.params.Destination_id)
        .then((destination) => {
            if (!destination) return res.status(404).json({ error: 'destination not found' })
            const reviewIndex = destination.reviews.findIndex(
                (review) => review._id.toString() === req.params.review_id
            );
            if (reviewIndex === -1) {
                return res.status(404).json({ error: 'Review not found' });
            }
            destination.reviews[reviewIndex].text = req.body.text;
            destination.save()
                .then((destination) => res.json(destination.reviews[reviewIndex]))
                .catch(next);
        })
        .catch(next);
};

//delete a review

const deleteReviewById = (req, res, next) => {
    Destination.findById(req.params.Destination_id)
        .then(destination => {
            if (!destination) return res.status(404).json({ error: 'destination not found' })
            const reviewIndex = destination.reviews.findIndex(
                (review) => review._id.toString() === req.params.review_id
            );
            if (reviewIndex === -1) {
                return res.status(404).json({ error: 'Review not found' });
            }
            destination.reviews.splice(reviewIndex, 1);
            destination.save()
                .then(() => res.json({ message: 'Review deleted successfully' }))
                .catch(next);
        })
        .catch(next);
};

// Export the controller functions
module.exports = {
    createReview,
    getAllReviews,
    deleteAllReviews,
    getReviewById,
    updateReviewById,
    deleteReviewById,
};