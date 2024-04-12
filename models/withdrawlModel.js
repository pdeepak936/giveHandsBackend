const mongoose = require('mongoose');

const depositTransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  bankAccountNumber: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const WithdrawlTransactionModel = mongoose.model('WithdrawlTransaction', depositTransactionSchema);

module.exports = WithdrawlTransactionModel;
