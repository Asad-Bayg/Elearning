const customerModel = require("../model/customers");
const accountModel = require("../model/account");
const transactionModel = require("../model/transaction");
const { validationResult } = require("express-validator");

exports.customerData = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    let { msg } = errors[0];
    const error = new Error(msg);
    error.statusCode = 422;
    return next(error);
  }

  let { username } = req.body;

  try {
    let customer = await customerModel
      .findOne({ username })
      .select("name birthdate email accounts -_id");

    if (!customer) {
      const error = new Error("customer does not exist");
      error.statusCode = 400;
      throw error;
    }

    let AccountId = customer.accounts;

    let account = await accountModel
      .find({ account_id: { $in: AccountId } })
      .select("account_id limit -_id");

    let transaction = await transactionModel
      .find({
        account_id: { $in: AccountId },
      })
      .select("transaction_count account_id -_id");

    let accounts = [];

    account.filter((v, i) => {
      transaction.find((val) => {
        if (v.account_id == val.account_id) {
          accounts.push({
            transaction_count: val.transaction_count,
            account_id: v.account_id,
            limit: v.limit,
          });
        }
      });
    });

    customer.accounts = accounts;

    res.json({
      customer,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
