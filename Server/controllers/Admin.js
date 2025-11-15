/**
 * Admin Controller
 * ---------------
 * Centralized helpers that power the elevated "Admin" role.
 * Every handler assumes that the auth middleware already validated the
 * JWT and that the `isAdmin` guard has run before execution.
 */
const User = require("../models/User")
const Profile = require("../models/Profile")

/**
 * Fetches a list of instructors who are still awaiting approval.
 * Used to populate the Admin dashboard queue.
 */
exports.getPendingInstructors = async (req, res) => {
  try {
    const instructors = await User.find({
      accountType: "Instructor",
      approved: false,
    })
      .select("-password -token")
      .populate("additionalDetails")
      .exec()

    return res.status(200).json({
      success: true,
      data: instructors,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch pending instructors",
      error: error.message,
    })
  }
}

/**
 * Returns every registered user regardless of role.
 * This supports auditing and quick lookups from the Admin panel.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password -token")
      .populate("additionalDetails")
      .exec()

    return res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch users",
      error: error.message,
    })
  }
}

/**
 * Marks an instructor as approved which unlocks instructor-only features.
 * Rejects invalid IDs as well as non-instructor documents defensively.
 */
exports.approveInstructor = async (req, res) => {
  try {
    const { id } = req.params

    const instructor = await User.findById(id)

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      })
    }

    if (instructor.accountType !== "Instructor") {
      return res.status(400).json({
        success: false,
        message: "User is not an instructor",
      })
    }

    if (instructor.approved) {
      return res.status(200).json({
        success: true,
        message: "Instructor already approved",
      })
    }

    instructor.approved = true
    await instructor.save()

    return res.status(200).json({
      success: true,
      message: "Instructor approved successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to approve instructor",
      error: error.message,
    })
  }
}

/**
 * Permanently rejects an instructor request by deleting the associated user.
 * Any attached profile document is also cleaned up to avoid dangling data.
 */
exports.rejectInstructor = async (req, res) => {
  try {
    const { id } = req.params

    const instructor = await User.findById(id)

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      })
    }

    if (instructor.accountType !== "Instructor") {
      return res.status(400).json({
        success: false,
        message: "User is not an instructor",
      })
    }

    if (instructor.additionalDetails) {
      await Profile.findByIdAndDelete(instructor.additionalDetails)
    }
    await User.findByIdAndDelete(id)

    return res.status(200).json({
      success: true,
      message: "Instructor rejected and removed",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to reject instructor",
      error: error.message,
    })
  }
}

