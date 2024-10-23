const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
   type: 'string',
   base: joi.string(),
   messages: {
      'string.escapeHTML': '{{#label}} must not include HTML!'
   },
   rules: {
      escapeHTML: {
         validate(value, helpers) {
            const clean = sanitize(value, {
               allowedTags: [],
               allowedAttributes: {},
            });
            if (clean !== value) return helpers.error('string.escapeHTML', { value })
            return clean;
         }
      }
   }
})

const Joi = baseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
   campground: Joi.object({
      name: Joi.string().required().escapeHTML,
      price: Joi.number().required().min(0),
      // image: Joi.string().required(),
      location: Joi.string().required().escapeHTML,
      description: Joi.string().required().min(10).escapeHTML,
   }).required(),
   deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
   review: Joi.object({
      body: Joi.string().required().escapeHTML,
      rating: Joi.number().min(1).max(5).required()
   }).required()
})


