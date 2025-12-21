const Joi=require("joi");
module.exports.bookSchema=Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    author:Joi.string().required(),
    price:Joi.number().required().min(0),
    imageUrl:Joi.string().required(),
    category:Joi.string().required(),
    quantity:Joi.number().required().min(1)
});
module.exports.reviewSchema=Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required()
});