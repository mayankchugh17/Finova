const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
    
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token)
        {
            return res.status(401).json({message:"Unauthorized access, Token is missing"})
        }

        // Verify Token
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(verifiedToken.userId);
        req.user = user;
        return next();
    }catch(error)
    {
        console.error("Auth Middleware Error", error)
    }
};

module.exports = {authMiddleware};