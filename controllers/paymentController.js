// controllers/paymentController.js
const Razorpay = require("../config/razorpay");
const shortid = require("shortid");

const payment = async (req, res) => {
  try {
    const payment_capture = 1;
    const amount = 500 * 100; // ₹500 in paise
    const currency = "INR";

    const options = {
      amount,
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    const response = await Razorpay.orders.create(options);
    console.log("Razorpay Order:", response);

    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).send("Payment failed");
  }
};

module.exports = payment;
