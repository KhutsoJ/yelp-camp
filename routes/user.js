const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

const { storeReturnTo } = require('../middleware');
const user = require('../controllers/users');


router.route('/register')
   .get(user.getRegisterForm) //GET REGISTER FORM
   .post(wrapAsync(user.register)) //POST REGISTER FORM

router.route('/login')
.get(user.getLoginForm)     //GET LOGIN FORM
.post(                   //POST LOGIN FORM
   storeReturnTo, 
   passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), 
   user.login
);


router.get('/logout', user.logout); //LOGOUT THE USER

module.exports = router;

