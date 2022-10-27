const transactionModel = require("../model/transaction");
const { validationResult } = require("express-validator");

exports.sellAndBuy = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    let { msg } = errors[0];
    const error = new Error(msg);
    error.statusCode = 422;
    return next(error);
  }

  const { account_id } = req.body;
  let accNum = parseInt(account_id);

  try {
    const data = await transactionModel.aggregate([
      {
        $match: {
          account_id: accNum,
        },
      },
      { $unwind: "$transactions" },
      {
        $group: {
          _id: "$transactions.transaction_code",
          totalAmount: { $sum: "$transactions.amount" },
        },
      },
    ]);
    let sellAmount = data.find((v) => {
      return v._id == "sell";
    });

    let buyAmount = data.find((v) => {
      return v._id == "buy";
    });

    if (!sellAmount || !buyAmount) {
      const error = new Error("buying or selling amount are missing");
      error.statusCode = 400;
      throw error;
    }

    res.json({
      total_amount_sold: sellAmount.totalAmount,
      total_amount_bought: buyAmount.totalAmount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
