const express = require("express");
const accountRouter = express.Router();

const authMiddleware = require("../middleware/auth.middleware.js");
const createAccountController = require("../controllers/account.controller.js");

accountRouter.post("/", authMiddleware.authMiddleware, createAccountController)

module.exports = accountRouter;
