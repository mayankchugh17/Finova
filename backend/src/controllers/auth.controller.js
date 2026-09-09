const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

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
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login Controller

const loginUser = async (req, res) =>{
    const {email, password} = await req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({message: "Invalid email or password"});
    }

    const isPasswordValid = await User.comparePassword(password);
    if(!isPasswordValid){
        return res.status(401).json({message: "Invalid email or password"}); 
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn : "3d"});
    res.cookie("token", token);
    res.status(200).json({user: {
            id: user._id,
            email: user.email,
            name: user.name
        }});

}

module.exports = { registerUser, loginUser };
