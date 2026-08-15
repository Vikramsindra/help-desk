import Joi from "joi";

const userSchema = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("user", "admin").default("user"),
});

export { userSchema };