const express = require("express");
const router = express.Router();
const expressValidator = require("express-validator");
const { body } = expressValidator;
const customerController = require("../controller/customers");

router.post(
  "/info",
  [body("username").trim().not().isEmpty()],
  customerController.customerData
);

module.exports = router;
