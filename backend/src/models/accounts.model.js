const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user", //Collection Name
        required: [true, "Account must be associated with a user"],
        index:true      //Creating an index
    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE", "FROZEN", "CLOSED"],
        },
        default:"ACTIVE"
    },
    currency:{
        type:String,
        required:[true, "Currency is required for creating an account"],
        default:"INR"
    },

},{
    timestamps:true
});

// Creating compound Index (Index in Multiple Fields in same collection and 1 means ascending order and -1 is decending order )
accountSchema.index({user:1, status:1})

const Accounts = mongoose.model("accounts", accountSchema);

module.exports = Accounts;