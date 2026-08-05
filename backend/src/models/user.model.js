const mongoose = require("mongoose");
const bcrypt = required("bcryptjs");
const userSchema = new mongoose.Scheme({
    email:{
        type:String,
        required:[true, "Please provide an email"],
        trim:true,
        lowercase:true,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email"],
        unique:[true, "Email already exists"]
    },
    name:{
        type:String,
        required:[true, "Please provide a name"],
        trim:true
    },
    password:{
        type:String,
        required:[true, "Please provide a password"],
        trim:true,
        minLength:[8, "Password must be at least 8 characters long"],
        select:false
    }
},{timestamps:true});

// This function exectues before any operation on userSchema like save, update, delete etc.
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
})

// Comparing password
userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

// Creating model
const User = mongoose.model("User", userSchema);

module.exports = User;