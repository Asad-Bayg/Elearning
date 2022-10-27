const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const transactionsController = require("../controller/transactions");

router.post(
  "/amount",
  [body("account_id").trim().not().isEmpty()],
  transactionsController.sellAndBuy
);

module.exports = router;
