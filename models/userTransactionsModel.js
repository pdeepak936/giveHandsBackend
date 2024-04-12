const mongoose = require("mongoose");
const userTransactionsSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  amount: {
    type: Number
  },
  bankName:{
    type: String
  }, 
  branchName:{
    type: String
  }, 
  accountHolderName:{
    type: String
  }, 
  bankAccountNumber:{
    type: String
  }, 
  ifscCode:{
    type: String
  },
  deposit_done: {
    type: Boolean,
    default: false,
  },
  withdrawl_done: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  formattedDate: String,
});
const UserTransactionsModel = mongoose.model("UserTransactions", userTransactionsSchema);
module.exports = UserTransactionsModel;
