/**
 * PAYMENT ROUTES - FULLY FIXED
 * Endpoints:
 * 1. /capturePayment    → Create Razorpay order
 * 2. /verifyPayment     → Verify signature + Enroll
 * 3. /sendPaymentSuccessEmail → Send receipt
 */
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments")
const { auth, isStudent } = require("../middlewares/auth")

router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment", auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail)

module.exports = router