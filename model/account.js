const mongoose = require("mongoose");
const schema = mongoose.Schema;

const accountScheama = new schema({
  account_id: { type: Number },
  limit: { type: Number },
});

module.exports = mongoose.model("accounts", accountScheama);
