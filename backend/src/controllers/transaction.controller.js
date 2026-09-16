const mongoose = require("mongoose");
const Accounts = require("../models/accounts.model.js");
const Transaction = require("../models/transactions.model.js");
const Ledger = require("../models/ledger.model.js");
const {sendTransactionEmail} = require("../services/email.services.js");

async function createTransaction(req, res) {

    // 1. Getting User Data
  const { fromAccount, toAccount, amount, idempotencyKey } = res.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(401).json({
      message:
        "fromAccount, toAccount, amount and idempotencyKey are required.",
    });
  }

  const fromUserAccount = await Accounts.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await Accounts.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res
      .status(400)
      .json({ message: "Invalid fromAccount or toAccount" });
  }

  // 2. Validate idempotencyKey (checking the have another transaction done before)
  const isTransactionAlreadyExists = await Transaction.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    //  Payment Done ??
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already proceed",
        transaction: isTransactionAlreadyExists,
      });
    }

    //  Transaction Pending
    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({ message: "Transaction is being processed." });
    }

    // Failed Transaction
    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(500).json({ message: "Payment Failed" });
    }

    // Reversed
    if (isTransactionAlreadyExists === "REVERSED") {
      return res.status(500).json({message:"Transaction has been reversed."});
    }
  }

//   3. Check Account Status (Only Active Accouunts Allowed for transaction)
  if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE")
  {
    return res.status(400).json({message:"Both fromAccount and toAccount must be ACTIVE for processing transaction."})
  }

  // check balance
  const balance = await fromUserAccount.getBalance();
  if(balance<amount)
  {
    return res.status(400).json({message:`Insufficient balance. Current balance is ${balance}.`});
  }
  
  // 4. Creating transaction in mongoose (means operations in this will all be executed or none);

  const session = await mongoose.startSession();
  session.startTransaction();
  const transaction = await Transaction.create({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"
  }, {session});

  const creditLedgerEntry = await Ledger.create({
    account: toAccount,
    amount:amount,
    transaction: transaction._id,
    type:"CREDIT"
  }, {session});

   const debitLedgerEntry = await Ledger.create({
    account: fromAccount,
    amount:amount,
    transaction: transaction._id,
    type:"DEBIT"
  }, {session});

  // Transaction Done
  transaction.status = "COMPLETED";
  await transaction.save({session});

  // End Session and transaction
  await session.commitTransaction();
  session.endSession();

  // Send Email for deduction
  await sendTransactionEmail(req.user.email, req.user.name, amount,toAccount._id );
  return res.status(201).json({message:"Transaction completed successfully", transaction})
}


module.exports = {createTransaction};