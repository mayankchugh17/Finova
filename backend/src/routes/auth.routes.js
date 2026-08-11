const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller.js")
const authRouter = express.Router();


// POST request
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);


module.exports = authRouter;