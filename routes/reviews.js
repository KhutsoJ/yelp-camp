const express = require('express');
const router = express.Router({ mergeParams: true });

const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');
const { reviewSchema } = require('../schemas');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');



const validateReview = (req, res, next) => {
   const { error } = reviewSchema.validate(req.body);

   if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
}

//POST REVIEW
router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
   const campground = await Campground.findById(req.params.id);
   const review = new Review(req.body.review);
   campground.reviews.push(review);
   await review.save();
   await campground.save();
   req.flash('success', 'Review successfully added');
   res.redirect(`/campgrounds/${campground._id}`);
}))

//DELETE REVIEW
router.delete('/:reviewId', isLoggedIn, wrapAsync(async (req, res) => {
   const { id, reviewId } = req.params;
   await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   await Review.findByIdAndDelete(reviewId);
   req.flash('success', 'Review deleted');
   res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
