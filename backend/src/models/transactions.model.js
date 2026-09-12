const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    fromAccounut: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true, "Transaction must be associated with from Account"],
        index:true
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true, "Transaction must be associated with from Account"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message:"Status can be either PENDING, COMPLETED, FAILED or REVERSED"
        },
        default:"PENDING"
    },
    amount:{
        type: Number,
        required:[true, "Amount is required for creating a transaction"],
        min:[0, "Transaction amount can not be negative"]
    },

    // used to track transaction
    idempotencyKey:{
        type:String,
        required:[true, "Idempotency Key is required for creating a transaction"],
        index:true, 
        uniqure:true
    }
}, {timestamps:true});

// Creating Model
const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;