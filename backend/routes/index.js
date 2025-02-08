import express from "express";

import userRouter from "./users.js";
import eventRouter from "./events.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello World!");
})
router.use('/user', userRouter);
router.use('/event', eventRouter);

export default router;