// routes/payment.js
const express = require("express");
const router = express.Router();
const razorpay = require("../config/razorpay");
const payment = require("../controllers/paymentController");
const Razorpay = require("razorpay")

router.post("/process",payment);

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

router.post("/create-order", async (req, res) => {
    try {
        const amount = req.body.amount * 100; // converting to paise
        const options = {
            amount,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`

        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ orderId: order.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
