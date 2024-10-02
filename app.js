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
      console.log("ERROR:"  + err.message);
   })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
   console.log("LISTENING ON PORT 3000");
})



app.get('/', (req, res) => {
   res.render('home')
})

app.get('/Campground/make', async (req, res) => {
   const camp = new Campground({
      name: 'Yard Camp', 
      price: '$ 900', 
      location: 'My Backyard'
   });
   await camp.save();
   res.send(camp);
})