import User from "../models/User.Model.js";
import { userSchema } from "../utils/Schema.Validation.js";

const registerController = async (req, res) => {
    const data = req.body;
    const { error, value } = userSchema.validate(data);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    res.status(201).json({ message: value });

};



export { registerController };