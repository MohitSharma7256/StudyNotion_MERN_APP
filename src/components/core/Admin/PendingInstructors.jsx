import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"

import {
  approveInstructor,
  getPendingInstructors,
  rejectInstructor,
} from "../../../services/operations/adminAPI"

const PendingInstructors = () => {
  const { token } = useSelector((state) => state.auth)
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState("")

  const fetchPending = useCallback(async () => {
    if (!token) {
      return
    }
    setLoading(true)
    const data = await getPendingInstructors(token)
    setPending(data)
    setLoading(false)
  }, [token])

  useEffect(() => {
    fetchPending()
  }, [fetchPending])

  const handleDecision = async (id, action) => {
    setActionLoadingId(id)
    const didSucceed =
      action === "approve"
        ? await approveInstructor(token, id)
        : await rejectInstructor(token, id)

    if (didSucceed) {
      setPending((prev) => prev.filter((instructor) => instructor._id !== id))
    }
    setActionLoadingId("")
  }

  if (loading) {
    return (
      <div className="grid min-h-[200px] place-items-center">
        <div className="spinner" />
      </div>
    )
  }

  if (pending.length === 0) {
    return (
      <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-8 text-center text-richblack-200">
        No pending instructor requests right now. Great job keeping up!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-richblack-5">
          Pending Instructor Requests
        </h2>
        <p className="mt-2 text-richblack-200">
          Review instructor details carefully before approving access to dashboard
          tools.
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-richblack-700">
        <table className="min-w-full divide-y divide-richblack-700">
          <thead className="bg-richblack-900 text-left text-sm uppercase tracking-wider text-richblack-200">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-richblack-700 bg-richblack-800 text-sm text-richblack-50">
            {pending.map((instructor) => (
              <tr key={instructor._id}>
                <td className="px-6 py-4 font-medium text-richblack-5">
                  {instructor.firstName} {instructor.lastName}
                </td>
                <td className="px-6 py-4">{instructor.email}</td>
                <td className="px-6 py-4">
                  {instructor?.additionalDetails?.contactNumber || "—"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      className="rounded-md bg-caribbeangreen-400/20 px-4 py-2 text-sm font-semibold text-caribbeangreen-100 transition hover:bg-caribbeangreen-400/30"
                      disabled={actionLoadingId === instructor._id}
                      onClick={() => handleDecision(instructor._id, "approve")}
                    >
                      {actionLoadingId === instructor._id ? "Saving..." : "Approve"}
                    </button>
                    <button
                      className="rounded-md bg-pink-400/20 px-4 py-2 text-sm font-semibold text-pink-200 transition hover:bg-pink-400/30"
                      disabled={actionLoadingId === instructor._id}
                      onClick={() => handleDecision(instructor._id, "reject")}
                    >
                      {actionLoadingId === instructor._id ? "Saving..." : "Reject"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PendingInstructors

