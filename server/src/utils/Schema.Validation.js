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

export { userSchema, loginSchema };