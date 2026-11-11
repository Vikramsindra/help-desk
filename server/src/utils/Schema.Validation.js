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

const staffUpdateSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100),
  email: Joi.string().trim().lowercase().email(),
  role: Joi.string().valid("agent", "admin"),
  isActive: Joi.boolean(),
})
  .min(1)
  .unknown(false);

const staffListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).max(10000000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  role: Joi.string().valid("agent", "admin"),
  isActive: Joi.boolean(),
  search: Joi.string().trim().min(1).max(200),
}).unknown(false);

const directoryQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).max(10000000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().min(1).max(200),
  isActive: Joi.boolean(),
}).unknown(false);

const customerUpdateSchema = Joi.object({
  isActive: Joi.boolean().required(),
}).unknown(false);

const notificationListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).max(10000000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
}).unknown(false);

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required().min(8),
}).unknown(false);

const ticketSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),

  description: Joi.string().trim().min(1).max(20000).required(),

  category: Joi.string().trim().min(1).max(100).required(),

  priority: Joi.string().valid("low", "medium", "high").default("medium"),
}).unknown(false);

const userTicketUpdateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().min(1).max(20000),
  category: Joi.string().trim().min(1).max(100),
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
  category: Joi.string().trim().min(1).max(100),
  priority: Joi.string().valid("low", "medium", "high"),
  status: Joi.string().valid("open", "in progress", "resolved", "closed"),
})
  .min(1)
  .unknown(false);

const ticketListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).max(10000000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid("open", "in progress", "resolved", "closed"),
  priority: Joi.string().valid("low", "medium", "high"),
  category: Joi.string().trim().min(1).max(100),
  search: Joi.string().trim().min(1).max(200),
  sortBy: Joi.string()
    .valid("createdAt", "updatedAt", "assignedAt")
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
}).unknown(false);

const ticketAssignSchema = Joi.object({
  assignedTo: Joi.string()
    .pattern(/^[a-f\d]{24}$/i)
    .required(),
}).unknown(false);

const commentSchema = Joi.object({
  message: Joi.string().trim().required().min(1).max(5000),
  isInternal: Joi.boolean().default(false),
}).unknown(false);

export {
  userSchema,
  staffSchema,
  staffUpdateSchema,
  staffListQuerySchema,
  directoryQuerySchema,
  customerUpdateSchema,
  notificationListQuerySchema,
  loginSchema,
  ticketSchema,
  userTicketUpdateSchema,
  agentTicketUpdateSchema,
  adminTicketUpdateSchema,
  ticketListQuerySchema,
  ticketAssignSchema,
  commentSchema,
};
