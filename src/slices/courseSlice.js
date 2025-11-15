/**
 * Course Slice (Redux)
 * --------------------
 * Manages state for course creation/editing workflow.
 * 
 * State:
 * - step: Current step in course creation (1=Info, 2=Builder, 3=Publish)
 * - course: Full course object being created/edited
 * - editCourse: Boolean flag indicating edit mode vs create mode
 * - paymentLoading: Loading state for payment processing
 * 
 * Used by: AddCourse, EditCourse, CourseBuilderForm, Payment flows
 */
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1,              // Current step in multi-step form
  course: null,         // Course data object
  editCourse: false,    // Edit mode flag
  paymentLoading: false, // Payment processing state
}

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    // Update current step in course creation wizard
    setStep: (state, action) => {
      state.step = action.payload
    },
    // Store course data (used during creation/editing)
    setCourse: (state, action) => {
      state.course = action.payload
    },
    // Toggle edit mode (true = editing existing course, false = creating new)
    setEditCourse: (state, action) => {
      state.editCourse = action.payload
    },
    // Set payment processing loading state
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload
    },
    // Reset all course state (called when leaving course creation flow)
    resetCourseState: (state) => {
      state.step = 1
      state.course = null
      state.editCourse = false
    },
  },
})

export const {
  setStep,
  setCourse,
  setEditCourse,
  setPaymentLoading,
  resetCourseState,
} = courseSlice.actions

export default courseSlice.reducer