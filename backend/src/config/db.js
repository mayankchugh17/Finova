const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

function connectDB()
{
    try{
        mongoose.connect(process.env.MONGODB_URL)
        .then(()=>{
            console.log("MongoDB connected successfully")
        })
        .catch((err)=>{
            console.error(err);
            process.exit(1);
        })
    }
    catch(err){
        console.error(err);
    }
}

module.exports = connectDB;