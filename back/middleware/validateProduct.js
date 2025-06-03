const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  image_url: Joi.string().uri().optional()  // <-- aquí permites que venga una URL como texto
});

module.exports = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  next();
};
