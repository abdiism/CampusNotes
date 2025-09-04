// client/src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux"; // Assuming you want to use Redux
import { setUserData } from "../Redux/slices/user-slice"; // Assuming this action exists and handles the user object
// You might also need an action to set the token in Redux if you manage it there
// import { setAuthToken } from "../Redux/slices/auth-slice"; // Example

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // For Redux
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({}); // For express-validator errors

    const clearFieldError = (fieldName) => {
        setFormErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    };

    const loginUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormErrors({}); // Clear previous validation errors

        const credentials = { // Renamed for clarity
            userEmail,
            userPassword,
        };

        try {
            // This API call now expects a 200 OK for success.
            // Errors (like 400, 401, 404) will be caught in the catch block.
            const response = await axios.post(
                "http://localhost:6969/auth/login",
                credentials,
                { headers: { "Content-Type": "application/json" } }
            );

            // If we reach here, the API call was successful (e.g., status 200)
            const { token, user, message } = response.data; // Destructure from the successful response

            if (token && user) {
                // Store token
                localStorage.setItem("authToken", token); // For API calls

                // Dispatch user data to Redux
                dispatch(setUserData(user)); // Your original was dispatch(setUserData(result.data))
                                             // Now we dispatch just the user object.
                                             // Ensure setUserData action expects this user object structure.
                
                // Optional: Dispatch token to Redux if you manage it there too
                // dispatch(setAuthToken(token));

                toast.success(message || "Login successful!");
                navigate("/search"); // Navigate to the search page on success
            } else {
                // This case is unlikely if backend is correct, but good to have
                console.error("Login Success, but token or user missing in response:", response.data);
                toast.error("Login failed: Unexpected response from server.");
            }

        } catch (error) {
            console.error("Login Error Object:", error);
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                // Handle express-validator errors (HTTP 400)
                if (responseData.errors && Array.isArray(responseData.errors)) {
                    const newErrors = {};
                    responseData.errors.forEach(err => {
                        const fieldName = err.path || err.param;
                        if (fieldName) newErrors[fieldName] = err.msg;
                    });
                    setFormErrors(newErrors);
                    toast.error("Please correct the errors in the form.");
                } 
                // Handle other specific backend error messages (e.g., 401 "Invalid credentials", 404 "User not found")
                else if (responseData.message) { 
                    toast.error(responseData.message);
                } 
                // Generic fallback for other 4xx/5xx errors from backend
                else {
                    toast.error("Login failed. Please check your credentials or try again later.");
                }
            } else {
                // Network errors, CORS, or other issues where error.response is not available
                toast.error("An unexpected error occurred. Please check your network connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Your JSX for the form (using the structure from your "original code" screenshot)
    return (
        <div className="h-heightWithoutNavbar flex w-full items-center justify-center bg-gray-50 p-4"> {/* Using class from your original */}
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md sm:p-8">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
                    Welcome Back! {/* Title from your original */}
                </h1>
                <form className="space-y-4" onSubmit={loginUser} noValidate> {/* Added noValidate */}
                    <div>
                        <label
                            className="mb-1 block text-sm font-medium text-gray-700"
                            htmlFor="userEmail"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="userEmail"
                            name="userEmail"
                            // required // Rely on backend validation for messages
                            className="block w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            placeholder="you@example.com"
                            value={userEmail}
                            onChange={(e) => { setUserEmail(e.target.value); clearFieldError('userEmail');}}
                        />
                        {formErrors.userEmail && <p className="mt-1 text-xs text-red-500">{formErrors.userEmail}</p>}
                    </div>

                    <div>
                        <label
                            className="mb-1 block text-sm font-medium text-gray-700"
                            htmlFor="userPassword"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                id="userPassword"
                                name="userPassword"
                                // required
                                className="block w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                placeholder="••••••••"
                                value={userPassword}
                                onChange={(e) => { setUserPassword(e.target.value); clearFieldError('userPassword');}}
                            />
                        </div>
                        {formErrors.userPassword && <p className="mt-1 text-xs text-red-500">{formErrors.userPassword}</p>}
                    </div>

                    <button
                        className={`w-full rounded-lg bg-teal-500 px-5 py-2.5 text-center font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 ${isLoading ? "cursor-not-allowed opacity-75" : ""}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging In..." : "Log In"}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        New to CampusNotes?{" "}
                        <Link to="/signup" className="font-medium text-teal-600 hover:underline">
                            Create an account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;