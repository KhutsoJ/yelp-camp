// SEEDS DATABASE ISN'T REQUIRED
// USEFUL TO JUST POPULATE DATABASE WITH DATA


//GET RANDOM IMAGES:
//https://api.unsplash.com/photos/random?client_id=IB-pf-kAqn_b4WVQmlgcAYPTkWLvHrOEmldEcW3wqMs&query=in-the-woods&count=1
//KEY:
//IB-pf-kAqn_b4WVQmlgcAYPTkWLvHrOEmldEcW3wqMs

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const seedHelper = require('./seedHelper');
const axios = require('axios');
const maptilerClient = require('@maptiler/client');

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
   .then(() => {
      console.log("Connected");
   })
   .catch(err => {
      console.log("ERROR:" + err.message);
   })

const seedDB = async () => {
   await Campground.deleteMany({});
   // const { places: places, descriptors: descriptors } = seedHelper;
   //SEEDS LISTS REF
   const places = seedHelper.places;
   const descriptors = seedHelper.descriptors;
   const citiesList = cities;

   for (let i = 0; i < 50; i++) {
      //CREATE A RANDOM CAMP NAME
      const place = sample(places).sample;
      const descriptor = sample(descriptors).sample;
      const name = `${descriptor} ${place}`;
      //RANDOM LOCATION
      const { sample: location, index: locationIndex } = sample(citiesList);
      const city = location.city;
      const state = location.state;
      const locationName = `${city}, ${state}`;
      const longitude = citiesList[locationIndex].longitude;
      const latitude = citiesList[locationIndex].latitude;
      //RANDOM IMAGE
      const imageData = await axios.get('https://api.unsplash.com/photos/random?client_id=IB-pf-kAqn_b4WVQmlgcAYPTkWLvHrOEmldEcW3wqMs&query=in-the-woods&count=2&orientation=squarish');
      let images = [];
      for (d of imageData.data) {
         images.push({ url: d.urls.regular, filename: d.user.id });
      }
      //CREATE CAMPGROUND AND SAVE DATABASE
      const campground = new Campground({
         author: '670abccecac6adfc4dfc8bba',
         name: name,
         geometry: {
            type: 'Point',
            coordinates: [
               longitude,
               latitude
            ]
         },
         location: locationName,
         price: Math.floor(Math.random() * 30) + 10,
         description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque eius praesentium vero nulla doloribus eum nisi accusantium expedita dignissimos aliquam corrupti, amet, ipsum fugiat blanditiis repudiandae illum dolore animi magni!',
         images: images
      });
      await campground.save();
   }
}

seedDB().then(() => {
   console.log("Database seeded");
   mongoose.connection.close().then(() => console.log("Database closed"));
})

//RETURN RANDOM ELEMENT/SAMPLE IN ARRAY (name, city, etc)
const sample = (array) => {
   const randomIndex = Math.floor(Math.random() * array.length);
   return {
      sample: array[randomIndex],
      index: randomIndex
   };
};

// const sample = array => {
//    return Math.floor(Math.random() * array.length);
// }
