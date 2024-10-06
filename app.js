//PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMateEngine = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema } = require('./schemas.js');

const app = express();

app.engine('ejs', ejsMateEngine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
   .then(() => {
      console.log("Database connected");
   })
   .catch(err => {
      console.log("ERROR:" + err.message);
   })



app.listen(3000, () => {
   console.log("LISTENING ON PORT 3000");
})

const validateCampground = (req, res, next) => {
   const { error } = campgroundSchema.validate(req.body);

   if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
}


//CRUD FUNCTIONALITY
app.get('/', (req, res) => {
   res.render('home')
})

//GET CAMPGROUNDS INDEX
app.get('/campgrounds', wrapAsync(async (req, res) => {
   const campgrounds = await Campground.find();
   res.render('campgrounds/index', { campgrounds });
}))

//GET "MAKE NEW CAMPGROUND" FORM
app.get('/campgrounds/create', (req, res) => {
   res.render('campgrounds/create');
})
//POST NEW CAMPGROUND
app.post('/campgrounds', validateCampground, wrapAsync(async (req, res, next) => {
   const campground = new Campground(req.body.campground);
   console.log(campground);
   await campground.save();
   res.redirect(`/campgrounds/${campground._id}`);
   next(e);
}))

//GET CAMPGROUND DETAILS
app.get('/campgrounds/:id', wrapAsync(async (req, res) => {
   const campground = await Campground.findById(req.params.id);
   res.render('campgrounds/show', { campground });
}))

//GET EDIT FORM FOR CAMPGROUND
app.get('/campgrounds/:id/edit', wrapAsync(async (req, res) => {
   const { id } = req.params;
   const campground = await Campground.findById(id);
   res.render('campgrounds/edit', { campground });
}))
//UPDATE THE CAMPGROUND
app.put('/campgrounds/:id', validateCampground, wrapAsync(async (req, res) => {
   const { id } = req.params;
   const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
   res.redirect(`/campgrounds/${id}`);
}))

//DELETE A CAMPGROUND
app.delete('/campgrounds/:id', wrapAsync(async (req, res) => {
   const { id } = req.params;
   const campground = await Campground.findByIdAndDelete(id);
   res.redirect(`/campgrounds`);
}))

//THROW ERROR IF REQUEST NOT FOUND: * -> COVERS ALL REQUESTS
app.all('*', (req, res, next) => {
   next(new ExpressError('PAGE NOT FOUND', 404));
})

//DISPLAY ERROR / GENERIC ERROR HANDLER
app.use((err, req, res, next) => {
   const { statusCode: status = 500 } = err;
   if (!err.message) err.message = 'Something went wrong!';
   res.status(status).render('error', { err });
})