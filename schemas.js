const Joi = require("joi");

const campgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  // image: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
  deleteImages: Joi.array(),
});

const reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  body: Joi.string().required(),
});

module.exports.campgroundSchema = campgroundSchema;
module.exports.reviewSchema = reviewSchema;
