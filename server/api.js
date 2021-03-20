const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const serverless = require("serverless-http");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var price = 29.99;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Stripe payment route
app.post("/charge", async (req, res) => {
  const token = req.body.stripeToken;

  const charge = await stripe.charges.create(
    {
      amount: (price * 100).toFixed(0),
      currency: "usd",
      description: "Boomer's Tutorial",
      source: token,
    },
    function (err, charge) {
      if (charge) {
        res.redirect("/thank-you");
      }
      if (err) {
        res.redirect("/payment");
      }
    }
  );
});

app.use("/", router);

module.exports.handler = serverless(app);
