import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("user route is working")
});


router.post("/register", (req, res) => {
    const user = req.body;
    console.log(user);
    res.send("data sent");
})

export default router;