const mongoose = require("mongoose")

/**
 * Section Schema
 * --------------
 * Logical grouping of several SubSections (lessons) within a course.
 */
const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
  },
  subSection: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
})

module.exports = mongoose.model("Section", sectionSchema)
