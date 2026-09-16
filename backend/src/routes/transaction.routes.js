const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const transactionRouter = express.Router();
const transactionController = require("../controllers/transaction.controller.js");

transactionRouter.post("/", authMiddleware, transactionController.createTransaction);