const express = require("express");
const connectDB = require("./config/db.js")
const app = express();

connectDB();

module.exports = app;