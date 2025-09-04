// client/src/pages/Signup.jsx
import React, { useState } from "react"; // Corrected 'usestate' to 'useState'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FaUpload } from "react-icons/fa";

const Signup = () => {
    const navigate = useNavigate();
    const [profilePreviewImage, setProfilePreviewImage] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userMobile, setUserMobile] = useState("");
    const [userBio, setUserBio] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // NEW: State to hold validation errors for each field
    const [formErrors, setFormErrors] = useState({});

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            setProfilePreviewImage(URL.createObjectURL(file));
            // Clear previous error for profileImage if a new image is selected
            setFormErrors(prevErrors => ({ ...prevErrors, profileImage: '' }));
        }
    };

    const clearFieldError = (fieldName) => {
        setFormErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    };

    const registerUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormErrors({}); // Clear previous errors on new submission

        if (!profileImage) {
            // This client-side check is good, but backend validation will also catch it.
            // We can also set a form error here for consistency.
            setFormErrors({ profileImage: "Profile image is required." });
            toast.error("Please upload a profile image.");
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("userBio", userBio);
        formData.append("userEmail", userEmail);
        formData.append("userMobile", userMobile);
        formData.append("userName", userName);
        formData.append("userPassword", userPassword);
        formData.append("profileImage", profileImage); // This is the File object

        try {
            const result = await axios.post(
                "http://localhost:6969/auth/signup", // Your backend URL
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            // console.log("Signup Success: ", result); // Keep for debugging if needed
            toast.success("Registration successful! Please log in.");
            navigate("/login");
        } catch (error) {
            // console.error("Signup Error: ", error); // Keep for debugging
            if (error.response && error.response.data) {
                if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    // Handle express-validator errors
                    const newErrors = {};
                    error.response.data.errors.forEach(err => {
                        // 'path' is used by express-validator v7+, 'param' by older versions
                        const fieldName = err.path || err.param;
                        if (fieldName) {
                            newErrors[fieldName] = err.msg;
                        }
                    });
                    setFormErrors(newErrors);
                    toast.error("Please correct the errors in the form.");
                } else if (error.response.data.message) {
                    // Handle other backend error messages (e.g., "User already exists")
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Registration failed. Please check your details or try again later.");
                }
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // --- JSX with Error Display ---
    return (
        <div className="flex w-full items-center justify-center bg-gray-50 py-8 px-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-md sm:p-8">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
                    Create Your Account
                </h1>
                <form className="space-y-4" onSubmit={registerUser} noValidate> {/* noValidate disables browser default validation */}
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center space-y-2">
                        <label className="text-sm font-medium text-gray-700">Profile Picture</label>
                        <div className="h-24 w-24 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {profilePreviewImage ? (
                                <img src={profilePreviewImage} alt="Profile Preview" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-xs text-gray-500">Preview</span>
                            )}
                        </div>
                        <label
                            htmlFor="profile-upload"
                            className="cursor-pointer rounded-md bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 inline-flex items-center gap-1"
                        >
                            <FaUpload className="text-gray-600" />
                            <span>Upload Image</span>
                            <input
                                id="profile-upload"
                                name="profileImage" // Name attribute is good practice
                                type="file"
                                className="sr-only"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleImageChange}
                            />
                        </label>
                        {/* NEW: Display error for profileImage */}
                        {formErrors.profileImage && <p className="text-xs text-red-500">{formErrors.profileImage}</p>}
                        {/* Your original client-side check display */}
                        {!profileImage && !formErrors.profileImage && formErrors.generalProfile !== false && <p className="text-xs text-red-500">Profile image is required.</p>}
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="firstName">First Name</label>
                            <input
                                type="text" id="firstName" name="firstName" // Added name attribute
                                className="input-field" placeholder="John"
                                value={firstName} onChange={(e) => { setFirstName(e.target.value); clearFieldError('firstName'); }}
                                // Removed 'required' to rely on backend validation messages
                            />
                            {formErrors.firstName && <p className="text-xs text-red-500">{formErrors.firstName}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="lastName">Last Name</label>
                            <input
                                type="text" id="lastName" name="lastName" // Added name attribute
                                className="input-field" placeholder="Doe"
                                value={lastName} onChange={(e) => { setLastName(e.target.value); clearFieldError('lastName'); }}
                            />
                            {formErrors.lastName && <p className="text-xs text-red-500">{formErrors.lastName}</p>}
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="userBio">Bio</label>
                        <textarea
                            id="userBio" name="userBio" rows="3" // Added name attribute
                            className="input-field"
                            placeholder="A short bio about yourself"
                            value={userBio} onChange={(e) => { setUserBio(e.target.value); clearFieldError('userBio'); }}
                        ></textarea>
                        {formErrors.userBio && <p className="text-xs text-red-500">{formErrors.userBio}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="userEmail">Email</label>
                        <input
                            type="email" id="userEmail" name="userEmail" // Added name attribute
                            className="input-field" placeholder="you@example.com"
                            value={userEmail} onChange={(e) => { setUserEmail(e.target.value); clearFieldError('userEmail'); }}
                        />
                        {formErrors.userEmail && <p className="text-xs text-red-500">{formErrors.userEmail}</p>}
                    </div>

                     {/* Mobile */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="userMobile">Mobile Number</label>
                        <input
                            type="tel" id="userMobile" name="userMobile" // Added name attribute
                            className="input-field" placeholder="+91 XXXXXXXXXX"
                            value={userMobile} onChange={(e) => { setUserMobile(e.target.value); clearFieldError('userMobile'); }}
                        />
                        {formErrors.userMobile && <p className="text-xs text-red-500">{formErrors.userMobile}</p>}
                    </div>

                    {/* Username */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="userName">Username</label>
                        <input
                            type="text" id="userName" name="userName" // Added name attribute
                            className="input-field" placeholder="johndoe123"
                            value={userName} onChange={(e) => { setUserName(e.target.value); clearFieldError('userName'); }}
                        />
                        {formErrors.userName && <p className="text-xs text-red-500">{formErrors.userName}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="userPassword">Password</label>
                        <input
                            type="password" id="userPassword" name="userPassword" // Added name attribute
                            className="input-field" placeholder="••••••••"
                            value={userPassword} onChange={(e) => { setUserPassword(e.target.value); clearFieldError('userPassword'); }}
                        />
                        {formErrors.userPassword && <p className="text-xs text-red-500">{formErrors.userPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full rounded-lg bg-teal-500 px-5 py-2.5 text-center font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 ${isLoading ? "cursor-not-allowed opacity-75" : ""}`}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-teal-600 hover:underline">
                            Log In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;