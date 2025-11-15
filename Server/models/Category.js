const mongoose = require("mongoose")

/**
 * Category Schema
 * ---------------
 * Represents a catalog bucket that groups multiple courses.
 */
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  course: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
})

module.exports = mongoose.model("Category", categorySchema)