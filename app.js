//PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

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




//CRUD FUNCTIONALITY
app.get('/', (req, res) => {
   res.render('home')
})

//GET CAMPGROUNDS INDEX
app.get('/campgrounds', async (req, res) => {
   const campgrounds = await Campground.find();
   res.render('campgrounds/index', { campgrounds });
})

//GET "MAKE NEW CAMPGROUND" FORM
app.get('/campgrounds/create', (req, res) => {
   res.render("campgrounds/create");
})

//POST NEW CAMPGROUND
app.post('/campgrounds/:id', async (req, res) => {
   const campground = new Campground(req.body.campground);
   await campground.save();
   res.redirect(`/campgrounds/${campground._id}`);
})

//GET CAMPGROUND DETAILS
app.get('/campgrounds/:id', async (req, res) => {
   const campground = await Campground.findById(req.params.id);
   res.render('campgrounds/show', { campground });
})