import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import {
  getAllUsers,
  getPendingInstructors,
} from "../../../services/operations/adminAPI"

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [pendingCount, setPendingCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      setLoading(true)
      const [pending, users] = await Promise.all([
        getPendingInstructors(token),
        getAllUsers(token),
      ])
      setPendingCount(pending.length)
      setUserCount(users.length)
      setLoading(false)
    }

    fetchStats()
  }, [token])

  if (loading) {
    return (
      <div className="grid min-h-[200px] place-items-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="space-y-8 text-richblack-5">
      <div>
        <h1 className="text-3xl font-semibold text-richblack-5">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
        </h1>
        <p className="mt-2 text-richblack-200">
          Manage instructors, review pending approvals, and keep the community safe.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-6 shadow-[0_0_20px_rgba(0,0,0,0.25)]">
          <p className="text-sm uppercase tracking-wide text-richblack-300">
            Total Users
          </p>
          <p className="mt-4 text-4xl font-bold text-yellow-50">{userCount}</p>
          <p className="mt-2 text-sm text-richblack-200">
            Includes students, instructors, and fellow admins.
          </p>
        </div>
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-6 shadow-[0_0_20px_rgba(0,0,0,0.25)]">
          <p className="text-sm uppercase tracking-wide text-richblack-300">
            Pending Instructors
          </p>
          <p className="mt-4 text-4xl font-bold text-pink-200">{pendingCount}</p>
          <p className="mt-2 text-sm text-richblack-200">
            Approve or reject instructor requests to unlock their dashboards.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/dashboard/admin/pending-instructors"
          className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-5 text-left transition hover:border-yellow-200"
        >
          <h2 className="text-xl font-semibold text-yellow-25">
            Review Pending Instructors
          </h2>
          <p className="mt-2 text-sm text-yellow-100">
            Examine instructor profiles and approve them when you are confident.
          </p>
        </Link>
        <Link
          to="/dashboard/admin/users"
          className="rounded-lg border border-richblack-700 bg-richblack-800 p-5 text-left transition hover:border-richblack-600"
        >
          <h2 className="text-xl font-semibold text-richblack-5">
            View All Users
          </h2>
          <p className="mt-2 text-sm text-richblack-200">
            Browse and audit every account registered on StudyNotion.
          </p>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard

