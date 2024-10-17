const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const { validateCampground, isAuthor, isLoggedIn } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });



//GET NEW CAMPGROUND FORM
router.get('/create', isLoggedIn, campgrounds.getCreateForm);

router.route('/')
   .get(wrapAsync(campgrounds.index)) //GET ALL CAMPGROUNDS
   .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground)); //POST NEW CAMPGROUND
   

router.route('/:id')
   .get(wrapAsync(campgrounds.showDetails)) //GET CAMPGROUND DETAILS
   .put(isLoggedIn, isAuthor, validateCampground, wrapAsync(campgrounds.updateDetails)) //UPDATE THE CAMPGROUND
   .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground)); //DELETE A CAMPGROUND

//GET CAMPGROUND EDIT FORM
router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.getEditForm));

module.exports = router;