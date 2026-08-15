import Joi from "joi";

const userSchema = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("user", "admin", "agent").default("user"),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
})

const ticketSchema = Joi.object({
    title: Joi.string()
        .trim()
        .required(),

    description: Joi.string()
        .trim()
        .required(),

    category: Joi.string()
        .trim()
        .required(),

    priority: Joi.string()
        .valid("low", "medium", "high")
        .default("medium"),

    status: Joi.string()
        .valid("open", "in progress", "resolved", "closed")
        .default("open"),

    assignedTo: Joi.string()
        .hex()
        .length(24)
        .allow(null)
        .default(null)
});


export { userSchema, loginSchema, ticketSchema };