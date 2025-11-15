const mongoose = require("mongoose")

/**
 * Profile Schema
 * --------------
 * Contains supplemental, mostly optional user information.
 * Kept in a separate collection so the core user document stays lean.
 */
const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
  },
})

module.exports = mongoose.model("Profile", profileSchema)