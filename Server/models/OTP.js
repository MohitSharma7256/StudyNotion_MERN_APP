const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const emailTemplate = require("../mail/templates/emailVerificationTemplate")

/**
 * OTP Schema
 * ----------
 * Stores a single-use verification code for signup flows.
 * TTL is five minutes thanks to MongoDB's `expires` option.
 */
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
})

// Helper to deliver the OTP email using the shared template.
async function sendVerificationOTP(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      emailTemplate(otp)
    )
    console.log("Email sent Successfully: ", mailResponse.response)
  } catch (error) {
    console.log("error occured while sending mails: ", error)
    throw error
  }
}

// Pre-save hook ensures every OTP write also dispatches an email.
OTPSchema.pre("save", async function (next) {
  console.log("Mail in pre hook", this.email)
  await sendVerificationOTP(this.email, this.otp)
  next()
})

module.exports = mongoose.model("OTP", OTPSchema)
