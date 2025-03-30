import axios from "axios";
import React, { useState } from "react";
import { setUserData } from "../Redux/slices/user-slice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
// Import icons if you add show/hide password
// import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For loading state
  // const [showPassword, setShowPassword] = useState(false); // For password visibility

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const user = {
      userEmail,
      userPassword,
    };

    try {
      const result = await axios.post("http://localhost:6969/auth/login", user);
      if (result.data.status === "Error") {
        toast.error(result.data.message || "Invalid email or password.");
        // Keep navigation commented if you want the user to stay on the login page on error
        // navigate("/login");
      } else {
        console.log("User Logged in Successfully: ", result);
        dispatch(setUserData(result.data));
        toast.success("Login successful!");
        navigate("/"); // Navigate to home on success
      }
    } catch (error) {
      console.error("Login Error: ", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <div className="h-heightWithoutNavbar flex w-full items-center justify-center bg-gray-50 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md sm:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
          Welcome Back!
        </h1>

        {/* Placeholder for Clerk SignIn component or Social Logins */}
        {/* If using Clerk, you might replace the form below with:
          <SignIn path="/login" routing="path" signUpUrl="/signup" /> 
          Or add social login buttons here:
          <div className="flex flex-col space-y-2 my-4">
            <button className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Sign in with Google</button>
            <button className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Sign in with GitHub</button>
          </div>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div> 
        */}

        <form className="space-y-4" onSubmit={loginUser}>
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
              required
              className="block w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              placeholder="you@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
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
                // type={showPassword ? "text" : "password"}
                type="password" // Keep as password for now
                id="userPassword"
                name="userPassword"
                required
                className="block w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                placeholder="••••••••"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
              {/* Add Show/Hide Button Here */}
              {/* <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button> */}
            </div>
            {/* Optional: Add Forgot Password Link */}
            {/* <div className="text-right text-sm mt-1">
              <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                Forgot password?
              </a>
            </div> */}
          </div>

          <button
            className={`w-full rounded-lg bg-teal-500 px-5 py-2.5 text-center font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 ${isLoading ? "cursor-not-allowed opacity-75" : ""}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Log In"}
          </button>

          <div className="text-center text-sm text-gray-600">
            New to FindMyNotes?{" "}
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