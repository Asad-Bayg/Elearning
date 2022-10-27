const mongooose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const customerRouter = require("./router/customers");
const transactionsRouter = require("./router/transactions");

const app = express();

app.use(bodyParser.json());

app.use("/api/customers", customerRouter);

app.use("/api/transactions", transactionsRouter);

app.use((error, req, res, next) => {
  const message = error.message;
  const status = error.statusCode || 500;
  res.status(status).json({
    message: message,
  });
});

mongooose
  .connect(
    "mongodb+srv://asadbaig:asadbaig@cluster0.4msrrkl.mongodb.net/elearning?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(300, () => {
      console.log("connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
