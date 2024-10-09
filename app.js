//PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMateEngine = require('ejs-mate');
const methodOverride = require('method-override');
const app = express();

const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

app.engine('ejs', ejsMateEngine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

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

//CAMPGROUND ROUTES//
app.use('/campgrounds', campgroundRoutes);


//REVIEW ROUTES//
app.use('/campgrounds/:id/reviews', reviewRoutes);




//THROW ERROR IF REQUEST NOT FOUND: * -> COVERS ALL REQUESTS
app.all('*', (req, res, next) => {
   next(new ExpressError('PAGE NOT FOUND', 404));
})

//DISPLAY ERROR / GENERIC ERROR HANDLER
app.use((err, req, res, next) => {
   const { statusCode = 500 } = err;
   if (!err.message) err.message = 'Something went wrong!';
   res.status(statusCode).render('error', { err });
})