import express from "express";
import { loginController, registerController } from "../controller/User.Controller.js"

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("user route is working")
});


router.post("/register", registerController);

router.post("/login", loginController);

export default router;