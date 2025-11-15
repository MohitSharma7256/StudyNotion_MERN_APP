import React from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

/**
 * PendingApproval
 * ---------------
 * Informational screen shown to instructors while they wait for admin approval.
 */
const PendingApproval = () => {
  const { user } = useSelector((state) => state.profile)

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center px-4 text-richblack-5">
      <div className="w-full max-w-[640px] rounded-lg border border-richblack-700 bg-richblack-800 p-8 shadow-2xl shadow-richblack-900/40">
        <h1 className="text-3xl font-semibold">Instructor Approval Pending</h1>
        <p className="mt-4 text-richblack-200">
          Thanks for signing up as an instructor{user?.firstName ? `, ${user.firstName}` : ""}! 
          Our admin team will review your profile shortly. You will receive an email at{" "}
          <span className="font-semibold text-richblack-5">{user?.email}</span> once your account is approved.
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-richblack-200">
          <li>Instructors cannot access dashboard tools until approval is complete.</li>
          <li>You can still browse courses and continue learning while you wait.</li>
          <li>If you believe this is taking too long, contact support with your registered email.</li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/"
            className="rounded-md bg-yellow-50 px-5 py-2 text-base font-semibold text-richblack-900"
          >
            Back to Home
          </Link>
          <Link
            to="/contact"
            className="rounded-md border border-richblack-600 px-5 py-2 text-base font-semibold text-richblack-5"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PendingApproval

