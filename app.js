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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

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
app.use(mongoSanitize());
app.use(helmet());
const User = require('./models/user');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelpCamp';
const secret = process.env.SECRET || 'thisshouldbeanactualsecret';

const store = MongoStore.create({
   mongoUrl: dbUrl,
   //DONT CONTINUOUSLY UPDATE IF DATA HAS NOT CHANGED (24H)
   touchAfter: 24 * 60 * 60,
   crypto: {
      secret: secret
   }
})

store.on("error",function(e) {
   console.log("SESSION STORE ERROR.", e);
})

const sessionConfig = {
   store: store,
   name: 'session',
   secret: secret,
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      // secure: true,
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

mongoose.connect(dbUrl)
   .then(() => {
      console.log("Database connected");
   })
   .catch(err => {
      console.log("ERROR:" + err.message);
   })

   const scriptSrcUrls = [
      "https://stackpath.bootstrapcdn.com/",
      "https://kit.fontawesome.com/",
      "https://cdnjs.cloudflare.com/",
      "https://cdn.jsdelivr.net",
      "https://cdn.maptiler.com/", // add this
  ];
  const styleSrcUrls = [
      "https://kit-free.fontawesome.com/",
      "https://stackpath.bootstrapcdn.com/",
      "https://fonts.googleapis.com/",
      "https://use.fontawesome.com/",
      "https://cdn.jsdelivr.net",
      "https://cdn.maptiler.com/", // add this
  ];
  const connectSrcUrls = [
      "https://api.maptiler.com/", // add this
  ];
const fontSrcUrls = [];

app.use(
   helmet.contentSecurityPolicy({
      directives: {
         defaultSrc: [],
         connectSrc: ["'self'", ...connectSrcUrls],
         scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
         styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
         workerSrc: ["'self'", "blob:"],
         objectSrc: [],
         imgSrc: [
            "'self'",
            "blob:",
            "data:",
            "https://res.cloudinary.com/dzwnndfye/",
            "https://images.unsplash.com/",
            "https://api.maptiler.com/",
         ],
         fontSrc: ["'self'", ...fontSrcUrls],
      },
   })
)

//PORT GIVEN BY SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`LISTENING ON PORT ${port}`);
})


app.use((req, res, next) => {
   res.locals.user = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
})

app.get('/fakeUser', async (req, res) => {
   const user = new User({ email: 'joy@gmail.com', username: 'khutsojoy' });
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