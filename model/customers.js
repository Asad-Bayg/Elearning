const mongoose = require("mongoose");
const schema = mongoose.Schema;

const customerSchema = new schema({
  username: { type: String },
  name: { type: String },
  address: { type: String },
  birthdate: { type: Date },
  email: { type: String },
  active: { type: Boolean },
  accounts: { type: Array },
  tier_and_details: { type: Object },
});

module.exports = mongoose.model("customers", customerSchema);
