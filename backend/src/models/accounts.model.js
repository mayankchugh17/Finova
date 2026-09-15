const mongoose = require("mongoose");
const Ledger = require("./ledger.model.js");
const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", //Collection Name
      required: [true, "Account must be associated with a user"],
      index: true, //Creating an index
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
      },
      default: "ACTIVE",
    },
    currency: {
      type: String,
      required: [true, "Currency is required for creating an account"],
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);

// Creating compound Index (Index in Multiple Fields in same collection and 1 means ascending order and -1 is decending order )
accountSchema.index({ user: 1, status: 1 });

// Calculate Balance of Sender account (suing aggregate pipeline)
accountSchema.methods.getBalance = async function () {
  const balanceData = await Ledger.aggregate([
    { $match: { account: this._id } },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
          },
        },
         totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
          },
        },
      },
      $project:{
        _id:0,
        balance:{ $subtract:["$totalCredit", "$totalDebit"]}
      }
    },
  ]);

  if(balanceData.length === 0)
  {
    return 0;
  }

  return balanceData[0].balance;
};
const Accounts = mongoose.model("accounts", accountSchema);

module.exports = Accounts;
