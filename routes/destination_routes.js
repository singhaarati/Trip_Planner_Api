const express = require('express');

const destination = require('../models/Destination')
const destinationController = require('../controllers/destinationController');
const reviewController = require('../controllers/reviewController');
const { verifyAdmin } = require('../middlewares/auth');
const { verifyUser } = require('../middlewares/auth')

const router = express.Router();

router.route('/')
    .get(destinationController.getAllDestinations)
    .post(verifyAdmin, destinationController.createDestination)
    .delete(verifyAdmin, destinationController.deleteAllDestinations)

router.route('/:Destination_id')
    .get(destinationController.getDestinationById)
    .put(destinationController.updateDestinationById)
    .delete(verifyAdmin, destinationController.deleteDestinationById)


//reviews

router.route('/:Destination_id/reviews')

    .get(reviewController.getAllReviews)
    .post(verifyUser, reviewController.createReview)
    .delete(verifyAdmin, reviewController.deleteAllReviews)


//REVIEWS_ID

router.route('/:Destination_id/reviews/:review_id')

    .get(verifyUser, reviewController.getReviewById)
    .put(verifyUser, reviewController.updateReviewById)
    .delete(verifyUser, reviewController.deleteReviewById)

module.exports = router;
