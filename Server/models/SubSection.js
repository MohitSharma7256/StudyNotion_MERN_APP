const mongoose = require("mongoose")

/**
 * SubSection Schema
 * -----------------
 * Smallest unit of course content (individual lecture/video).
 */
const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
})

module.exports = mongoose.model("SubSection", subSectionSchema)
