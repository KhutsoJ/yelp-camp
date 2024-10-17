//PACKAGES
if (process.env.NODE_ENV !== "production") {
   require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMateEngine = require('ejs-mate');
const methodOverride = require('method-override');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');

app.engine('ejs', ejsMateEngine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
const User = require('./models/user');


const sessionConfig = {
   secret: 'thisshouldbeanactualsecret',
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
   }
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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


app.use((req, res, next) => {
   res.locals.user = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
})

app.get('/fakeUser', async (req, res) => {
   const user = new User({email: 'joy@gmail.com', username: 'khutsojoy'});
   const registeredUser = await User.register(user, 'khutso001');
   res.send(registeredUser);
})


//CRUD FUNCTIONALITY
app.get('/', (req, res) => {
   res.render('home')
})

//USER AUTHENTICATION ROUTES//
app.use('/', userRoutes);
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