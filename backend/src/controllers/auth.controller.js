const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.services.js");

// User Registration Controller
const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = await User.create({ email, password, name });

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token);
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token
    });

    // send registration email
    await emailService.sendRegistrationEmail(user.email, user.name);
    
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login Controller

const loginUser = async (req, res) => {
  try {
    const { email, password } = await req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token);
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });

    await emailService.sendLoginEmail(user.email, user.name)
    .then(()=>{
      console.log("Email sent successfully!")
    })
    .catch((err)=>{
      console.error("Cant't sent Email", err)
    });
  } catch (error) {
    console.error("Login Error ", error);
    res.status(500).json({ message: "Login Failed" });
  }
};

module.exports = { registerUser, loginUser };
