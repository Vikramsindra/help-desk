import Joi from "joi";

const passwordSchema = Joi.string()
  .min(8)
  .pattern(/[A-Z]/)
  .pattern(/[a-z]/)
  .pattern(/[0-9]/)
  .pattern(/[^A-Za-z0-9]/)
  .required();

const userSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: passwordSchema,
})
  .required()
  .unknown(false);

const staffSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: passwordSchema,
  role: Joi.string().valid("agent", "admin").required(),
})
  .required()
  .unknown(false);

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required().min(8),
}).unknown(false);

const ticketSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),

  description: Joi.string().trim().min(1).max(20000).required(),

  category: Joi.string().trim().max(100).required(),

  priority: Joi.string().valid("low", "medium", "high").default("medium"),
}).unknown(false);

const userTicketUpdateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().min(1).max(20000),
  category: Joi.string().trim().max(100),
})
  .min(1)
  .unknown(false);

const agentTicketUpdateSchema = Joi.object({
  priority: Joi.string().valid("low", "medium", "high"),
  status: Joi.string().valid("open", "in progress", "resolved", "closed"),
})
  .min(1)
  .unknown(false);

const adminTicketUpdateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().min(1).max(20000),
  category: Joi.string().trim().max(100),
  priority: Joi.string().valid("low", "medium", "high"),
  status: Joi.string().valid("open", "in progress", "resolved", "closed"),
})
  .min(1)
  .unknown(false);

const commentSchema = Joi.object({
  message: Joi.string().trim().required().min(1).max(5000),
});

export {
  userSchema,
  staffSchema,
  loginSchema,
  ticketSchema,
  userTicketUpdateSchema,
  agentTicketUpdateSchema,
  adminTicketUpdateSchema,
  commentSchema,
};
