import express from "express";
import { registerController } from "../controller/User.Controller.js"

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("user route is working")
});


router.post("/register", registerController);

export default router;