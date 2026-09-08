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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email, password);
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Email or Password is Invalid" });
        }
        
        const isValidPassword = await user.comparePassword(password);
        if(!isValidPassword)
            {
                return res.status(401).json({message:"Email or Password is Invalid"});
            }
            
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:"1h"});
        res.cookie("token", token);
        return res.status(200).json({user:
          {
              _id:user._id, 
              email:user.email, 
              name:user.name
          }, 
          token})
            
        } catch (error) {
            console.error("Error login user", error);
            res.status(500).json({message: "Internal server error"});
        }
};
        
module.exports = { registerUser, loginUser };
