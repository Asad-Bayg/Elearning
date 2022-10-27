const mongoose = require("mongoose");
const schema = mongoose.Schema;

const transactionsSchema = new schema({
  account_id: { type: Number },
  transaction_count: { type: Number },
  bucket_start_date: { type: Date },
  bucket_end_date: { type: Date },
  transactions: [
    {
      date: { type: Date },
      amount: { type: Number },
      transaction_code: { type: String },
      symbol: { type: String },
      price: { type: Number },
      total: { type: Number },
    },
  ],
});

module.exports = mongoose.model("transactions", transactionsSchema);
