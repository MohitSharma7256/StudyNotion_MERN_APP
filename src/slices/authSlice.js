/**
 * Auth Slice (Redux)
 * ------------------
 * Manages authentication state across the application.
 * 
 * State:
 * - signupData: Temporary data stored during signup flow (before OTP verification)
 * - token: JWT token from localStorage (persists across page refreshes)
 * - loading: Loading state for auth operations (login, signup, etc.)
 * 
 * Used by: LoginForm, SignupForm, PrivateRoute, all authenticated API calls
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    signupData: null,  // Form data saved during signup (used after OTP verification)
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null, // JWT auth token
    loading:false      // Loading state for async auth operations
}

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        // Store signup form data temporarily (used between signup form and OTP verification)
        setSignupData: (state,value) =>{
            state.signupData = value.payload;
        },
        // Set loading state for auth operations
        setLoading(state, value) {
            state.loading = value.payload;
          },
          // Update JWT token (also persists to localStorage in authAPI.js)
          setToken(state, value) {
            state.token = value.payload;
          },
    }
})

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;