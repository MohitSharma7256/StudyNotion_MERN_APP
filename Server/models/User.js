const mongoose = require("mongoose")

/**
 * User Schema
 * -----------
 * Core account record used across the platform.
 * Fields capture identity, role, avatar, approval status,
 * and references to profile + enrolled courses.
 */
const userSchema = new mongoose.Schema({
  // Basic identity fields that appear on dashboards and certificates.
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },

  // Role drives authorization gates across the app.
  accountType: {
    type: String,
    enum: ["Student", "Instructor", "Admin"],
    required: true,
  },

  // Additional profile information lives in a separate document.
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },

  // List of courses created (instructor) or purchased (student).
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],

  // Password reset helpers.
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },

  // Avatar URL – defaults to dicebear in Auth controller.
  image: {
    type: String,
    required: true,
  },

  // Track lecture completion progress per course.
  courseProgress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],

  // Soft-delete flag for future use.
  active: {
    type: Boolean,
    default: true,
  },

  // Instructors must be approved by admin before accessing tools.
  approved: {
    type: Boolean,
    default: true,
  },
})

module.exports = mongoose.model("User", userSchema)
