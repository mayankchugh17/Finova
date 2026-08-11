const express = require("express");
const connectDB = require("./config/db.js");
const authRouter = require("./routes/auth.routes.js");
const cookieParser = require("cookie-parser");
const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

module.exports = app;