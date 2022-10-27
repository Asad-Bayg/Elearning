const customerModel = require("../model/customers");
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
    const data = await customerModel.aggregate([
      {
        $match: { username },
      },
      {
        $project: { name: 1, birthdate: 1, email: 1, accounts: 1, _id: 0 },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "accounts",
          foreignField: "account_id",
          as: "accountss",
        },
      },
      {
        $unwind: "$accounts",
      },

      {
        $unset: ["accounts._id", "accounts.products"],
      },
    ]);

    // await customerModel
    //   .findOne({ username })
    //   .select("name birthdate  email accounts -_id");

    if (!data) {
      const error = new Error("Donot Exist");
      error.statusCode = 400;
      throw error;
    }
    res.json({
      customer: data,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
