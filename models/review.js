const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
   body: {
      type: String,
      required: true
   },
   rating: {
      type: Number,
      min: 1,
      max: 5
   },
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
})

module.exports = mongoose.model('Review', ReviewSchema);