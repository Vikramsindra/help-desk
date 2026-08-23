import express from "express";
import {
  loginController,
  refreshController,
  registerController,
  logoutController,
} from "../controller/User.Controller.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("user route is working");
});

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/refresh", refreshController);
router.post("/logout", logoutController);

export default router;
