const express = require('express');
const router = express.Router();

const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');


const validateCampground = (req, res, next) => {
   const { error } = campgroundSchema.validate(req.body);

   if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
}




//GET ALL CAMPGROUNDS
router.get('/', wrapAsync(async (req, res) => {
   const campgrounds = await Campground.find();
   res.render('campgrounds/index', { campgrounds });
}))


//GET NEW CAMPGROUND FORM
router.get('/create', (req, res) => {
   res.render('campgrounds/create');
})
//POST NEW CAMPGROUND
router.post('/', validateCampground, wrapAsync(async (req, res, next) => {
   const campground = new Campground(req.body.campground);
   await campground.save();
   res.redirect(`/campgrounds/${campground._id}`);
}))

//GET CAMPGROUND DETAILS
router.get('/:id', wrapAsync(async (req, res) => {
   const campground = await Campground.findById(req.params.id).populate('reviews');
   res.render('campgrounds/show', { campground });
}))

//GET CAMPGROUND EDIT FORM
router.get('/:id/edit', wrapAsync(async (req, res) => {
   const { id } = req.params;
   const campground = await Campground.findById(id);
   res.render('campgrounds/edit', { campground });
}))
//UPDATE THE CAMPGROUND
router.put('/:id', validateCampground, wrapAsync(async (req, res) => {
   const { id } = req.params;
   const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
   res.redirect(`/campgrounds/${id}`);
}))

//DELETE A CAMPGROUND
router.delete('/:id', wrapAsync(async (req, res) => {
   const { id } = req.params;
   const campground = await Campground.findByIdAndDelete(id);
   res.redirect(`/campgrounds`);
}))

module.exports = router;