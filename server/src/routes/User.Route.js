import express from "express";
import { loginController, refreshController, registerController } from "../controller/User.Controller.js"

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("user route is working")
});


router.post("/register", registerController);

router.post("/login", loginController);

router.post("/refresh", refreshController);

export default router;