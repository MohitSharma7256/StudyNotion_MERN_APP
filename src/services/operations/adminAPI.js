import { toast } from "react-hot-toast"

import { apiConnector } from "../apiconnector"
import { adminEndpoints } from "../apis"

/**
 * Admin API Operations
 * --------------------
 * Thin helper layer that wraps admin endpoints with toasts + auth headers.
 */

const {
  ADMIN_PENDING_INSTRUCTORS_API,
  ADMIN_APPROVE_INSTRUCTOR_API,
  ADMIN_REJECT_INSTRUCTOR_API,
  ADMIN_USERS_API,
} = adminEndpoints

const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
})

export async function getPendingInstructors(token) {
  try {
    const response = await apiConnector(
      "GET",
      ADMIN_PENDING_INSTRUCTORS_API,
      null,
      authHeader(token)
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data || []
  } catch (error) {
    console.error("ADMIN_PENDING_INSTRUCTORS error", error)
    toast.error("Unable to load pending instructors")
    return []
  }
}

export async function getAllUsers(token) {
  try {
    const response = await apiConnector(
      "GET",
      ADMIN_USERS_API,
      null,
      authHeader(token)
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data || []
  } catch (error) {
    console.error("ADMIN_GET_USERS error", error)
    toast.error("Unable to load users")
    return []
  }
}

export async function approveInstructor(token, instructorId) {
  const toastId = toast.loading("Approving instructor...")
  try {
    const response = await apiConnector(
      "POST",
      `${ADMIN_APPROVE_INSTRUCTOR_API}/${instructorId}`,
      null,
      authHeader(token)
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Instructor approved")
    return true
  } catch (error) {
    console.error("ADMIN_APPROVE_INSTRUCTOR error", error)
    toast.error("Unable to approve instructor")
    return false
  } finally {
    toast.dismiss(toastId)
  }
}

export async function rejectInstructor(token, instructorId) {
  const toastId = toast.loading("Rejecting instructor...")
  try {
    const response = await apiConnector(
      "POST",
      `${ADMIN_REJECT_INSTRUCTOR_API}/${instructorId}`,
      null,
      authHeader(token)
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Instructor rejected")
    return true
  } catch (error) {
    console.error("ADMIN_REJECT_INSTRUCTOR error", error)
    toast.error("Unable to reject instructor")
    return false
  } finally {
    toast.dismiss(toastId)
  }
}

