const mongoose = require("mongoose")

/**
 * Rating & Review Schema
 * ----------------------
 * Connects a user, their review text, and the course being rated.
 * The `course` field is indexed to speed up lookup on course detail pages.
 */
const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
    index: true,
  },
})

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema)
