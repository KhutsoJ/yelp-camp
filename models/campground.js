//CREATING A NEW CAMPGROUND
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
   url: String,
   filename: String
})

//new virtual function call 'thumbnail'
ImageSchema.virtual('thumbnail').get(function () {
   return this.url.replace('/upload', '/upload/w_100');
})

const options = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
   name: String,
   price: Number,
   description: String,
   location: String,
   geometry: {
      type: {
         type: String,
         enum: ['Point'],
         required: true
      },
      coordinates: {
         type: [Number],
         required: true
      }
   },
   images: [ImageSchema],
   reviews: [{
      type: Schema.Types.ObjectId,
      ref: 'Review'
   }],
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
}, options)

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
   return `<a href="/campgrounds/${this._id}">${this.name}</a>`;
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
   if (doc) {
      await Review.deleteMany({
         _id: {
            $in: doc.reviews
         }
      })
   }
})

module.exports = mongoose.model('Campground', CampgroundSchema);