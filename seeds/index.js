// SEEDS DATABASE ISN'T REQUIRED
// USEFUL TO JUST POPULATE DATABASE WITH DATA


//GET RANDOM IMAGES:
   //https://api.unsplash.com/photos/random?client_id=IB-pf-kAqn_b4WVQmlgcAYPTkWLvHrOEmldEcW3wqMs&query=in-the-woods
//KEY:
   //IB-pf-kAqn_b4WVQmlgcAYPTkWLvHrOEmldEcW3wqMs

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const seedHelper = require('./seedHelper');

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
   .then(() => {
      console.log("Connected");
   })
   .catch(err => {
      console.log("ERROR:" + err.message);
   })

const seedDB = async () => {
   await Campground.deleteMany({});
   // const { places: placesList, descriptors: descriptorsList } = seedHelper;
   const placesList = seedHelper.places;
   const descriptorsList = seedHelper.descriptors;
   const citiesList = cities;

   for (let i = 0; i < 50; i++) {
      //CREATE A RANDOM NAME
      const place = sample(placesList);
      const descriptor = sample(descriptorsList);
      const name = `${descriptor} ${place}`;
      //RANDOM LOCATION
      const location = sample(citiesList);
      const city = location.city;
      const state = location.state;
      const locationName = `${city}, ${state}`;

      //CREATE CAMPGROUND AND SAVE DATABASE
      const campground = new Campground({
         name: name,
         location: locationName,
         price: Math.floor(Math.random() * 30) + 10,
         description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque eius praesentium vero nulla doloribus eum nisi accusantium expedita dignissimos aliquam corrupti, amet, ipsum fugiat blanditiis repudiandae illum dolore animi magni!',
         image: `https://api.unsplash.com/photos/random?client_id=IB-pf-kAqn_b4WVQmlgcAYPTkWLvHrOEmldEcW3wqMs&query=in-the-woods`
         
      });
      await campground.save();
   }
}

seedDB().then(() => {
   console.log("Database seeded");
   mongoose.connection.close().then(() => console.log("Database closed"))
})

//RETURN RANDOM ELEMENT/SAMPLE IN ARRAY (name, city, etc)
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// const sample = array => {
//    return Math.floor(Math.random() * array.length);
// }
