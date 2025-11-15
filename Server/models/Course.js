const mongoose = require("mongoose")

/**
 * Course Schema
 * -------------
 * Captures the main metadata, pricing, and relational links for a course.
 * Sections/subsections live in their own collections but are referenced here.
 */
const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
  },
  description: {
    type: String,
  },

  // Owning instructor is required. Used for dashboard, payouts, etc.
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Marketing copy that appears on the detail page.
  whatWillYouLearn: {
    type: String,
    trim: true,
  },

  // Ordered collection of Sections which themselves reference SubSections.
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],

  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],

  price: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  tags: {
    type: String,
  },

  // Category is used for catalog browsing.
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  // Students that purchased/enrolled in this course.
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],

  // Optional highlights and publishing workflow state.
  instructions: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Course", courseSchema)
