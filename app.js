//PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
   .then(() => {
      console.log("Database connected");
   })
   .catch(err => {
      console.log("ERROR:" + err.message);
   })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
   console.log("LISTENING ON PORT 3000");
})




//CRUD FUNCTIONALITY
app.get('/', (req, res) => {
   res.render('home')
})

app.get('/campgrounds', async (req, res) => {
   const campgrounds = await Campground.find();
   res.render('campgrounds/index', { campgrounds });
})