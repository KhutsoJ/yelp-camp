const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

const { storeReturnTo } = require('../middleware');

//GET REGISTER FORM
router.get('/register', (req, res) => {
   res.render('users/register');
})
// POST REGISTER FORM
router.post('/register', wrapAsync(async (req, res, next) => {
   try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
         if (err) return next(err);
         req.flash('success', 'Welcome to YelpCamp');
         res.redirect('/campgrounds');
      })
   } catch (e) {
      req.flash('error', e.message);
      res.redirect('/register');
   }
}))


//GET LOGIN FORM
router.get('/login', (req, res) => {
   res.render('users/login');
})
//POST LOGIN FORM
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
   req.flash('success', 'Welcome back!');
   const redirectUrl = res.locals.returnTo || '/campgrounds';
   console.log(redirectUrl);
   res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
   req.logout((err) => {
      if (err) {
         return next(err);
      }
      req.flash('success', 'Goodbye!');
      res.redirect('/campgrounds');
   })
})

module.exports = router;

