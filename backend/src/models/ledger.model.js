const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true, "Ledger must be associated with the Account"],
        index:true,
        immutable:true    //This field will not be modified
    },
    amount:{
        type:Number,
        required:[true, "Amount is required foor creating ledger"],
    },
    transaction:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"transaction",
       required:[true, "Ledger must be associated with transaction"],
       index:true,
       immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT", "DEBIT"],
            message: "Type can be CREDIT or DEBIT"
        },
        required:[true, "Type is compulsory to mention"],
        immutable:true
    }
});

function preventLedgerModification()
{
    throw new Error("Ledger entries are Immutable and cannot be modified and deleted");
}

// In these Database's operation this function will be called

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);
ledgerSchema.pre("remove", preventLedgerModification);

// Creating a Model
const Ledger = mongoose.model("ledger", ledgerSchema);

module.exports = Ledger;