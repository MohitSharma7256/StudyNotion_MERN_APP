const mongoose = require("mongoose")

/**
 * CourseProgress Schema
 * ---------------------
 * Maintains a list of sub-sections a user has completed for a course.
 * Used to power progress bars and resume-watching experiences.
 */
const courseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
})

module.exports = mongoose.model("CourseProgress", courseProgressSchema)
