/**
 * Admin Routes
 * ------------
 * Moderation endpoints reserved for ADMIN role users.
 */
const express = require("express")
const router = express.Router()

const {
  getPendingInstructors,
  approveInstructor,
  rejectInstructor,
  getAllUsers,
} = require("../controllers/Admin")
const { auth, isAdmin } = require("../middlewares/auth")

router.get("/pending-instructors", auth, isAdmin, getPendingInstructors)
router.get("/users", auth, isAdmin, getAllUsers)
router.post("/approve-instructor/:id", auth, isAdmin, approveInstructor)
router.post("/reject-instructor/:id", auth, isAdmin, rejectInstructor)

module.exports = router

