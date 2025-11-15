/**
 * API Endpoints Configuration
 * ----------------------------
 * Centralized endpoint definitions for all backend API calls.
 * All endpoints are prefixed with BASE_URL from environment variables.
 * 
 * Organization: Grouped by feature domain (Auth, Profile, Course, etc.)
 * Usage: Import specific endpoint groups in service files (e.g., authAPI.js)
 */
const BASE_URL = process.env.REACT_APP_BASE_URL

// Authentication & Authorization Endpoints
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",              // Send OTP for email verification
  SIGNUP_API: BASE_URL + "/auth/signup",                // Create new user account
  LOGIN_API: BASE_URL + "/auth/login",                  // User login
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token", // Generate password reset token
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password", // Reset password with token
}

// User Profile Endpoints
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",              // Get current user profile
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses", // Get student's enrolled courses
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",      // Get instructor dashboard stats
}

// Student Payment Endpoints
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",                // Create Razorpay order
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",                   // Verify payment signature
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail", // Send confirmation email
}

// Course Management Endpoints (Instructor & Student)
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
}

// CATAGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
}

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
}
// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

// Admin Management Endpoints (Admin-only)
export const adminEndpoints = {
  ADMIN_PENDING_INSTRUCTORS_API: BASE_URL + "/admin/pending-instructors",     // Get list of unapproved instructors
  ADMIN_APPROVE_INSTRUCTOR_API: BASE_URL + "/admin/approve-instructor",        // Approve instructor (set approved=true)
  ADMIN_REJECT_INSTRUCTOR_API: BASE_URL + "/admin/reject-instructor",         // Reject instructor (delete account)
  ADMIN_USERS_API: BASE_URL + "/admin/users",                                  // Get all users (students, instructors, admins)
}