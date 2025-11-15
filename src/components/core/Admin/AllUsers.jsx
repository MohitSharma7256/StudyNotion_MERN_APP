import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { HiOutlineRefresh } from "react-icons/hi"

import { getAllUsers } from "../../../services/operations/adminAPI"

const AllUsers = () => {
  const { token } = useSelector((state) => state.auth)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    if (!token) {
      return
    }
    setLoading(true)
    const data = await getAllUsers(token)
    setUsers(data)
    setLoading(false)
  }, [token])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  if (loading) {
    return (
      <div className="grid min-h-[200px] place-items-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-richblack-5">
            All Users
          </h2>
          <p className="mt-2 text-richblack-200">
            Audit every account and ensure only approved instructors gain dashboard access.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 rounded-md border border-richblack-600 px-4 py-2 text-sm font-semibold text-richblack-25 transition hover:border-yellow-100 hover:text-yellow-50"
        >
          <HiOutlineRefresh />
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-richblack-700">
        <table className="min-w-full divide-y divide-richblack-700">
          <thead className="bg-richblack-900 text-left text-sm uppercase tracking-wider text-richblack-200">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Approved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-richblack-700 bg-richblack-800 text-sm text-richblack-50">
            {users.map((entry) => (
              <tr key={entry._id}>
                <td className="px-6 py-4 font-medium text-richblack-5">
                  {entry.firstName} {entry.lastName}
                </td>
                <td className="px-6 py-4">{entry.email}</td>
                <td className="px-6 py-4">{entry.accountType}</td>
                <td className="px-6 py-4">
                  {entry.accountType === "Instructor" ? (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        entry.approved
                          ? "bg-caribbeangreen-400/20 text-caribbeangreen-100"
                          : "bg-pink-400/20 text-pink-200"
                      }`}
                    >
                      {entry.approved ? "Approved" : "Pending"}
                    </span>
                  ) : (
                    <span className="rounded-full bg-richblack-700 px-3 py-1 text-xs font-semibold text-richblack-200">
                      N/A
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllUsers

