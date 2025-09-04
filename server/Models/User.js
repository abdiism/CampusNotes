// server/Models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ // Changed from mongoose.Schema to new mongoose.Schema (standard practice)
    firstName: {
        type: String,
        required: [true, 'First name is required.'], // Added custom error message
        trim: true,                                 // ADDED: Remove whitespace
        maxlength: [50, 'First name cannot exceed 50 characters.'] // ADDED: Max length
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.'], // Added custom error message
        trim: true,                                // ADDED: Remove whitespace
        maxlength: [50, 'Last name cannot exceed 50 characters.']  // ADDED: Max length
    },
    userBio: {
        type: String,
        // Maxlength: 250, // Typo: 'Maxlength' should be 'maxlength'
        maxlength: [250, 'Bio cannot exceed 250 characters.'], // CORRECTED and added message
        trim: true,       // Already had trim, which is good
        default: ""       // ADDED: Default to empty string if not provided
    },
    userEmail: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,                                     // ADDED: Ensure email is unique
        lowercase: true,                                  // ADDED: Store email in lowercase
        trim: true,                                       // ADDED: Remove whitespace
        match: [/.+@.+\..+/, 'Please provide a valid email address.'] // ADDED: Basic email format validation
    },
    userMobile: {
        // type: Number, // CHANGED: Better to store phone numbers as String for formatting, leading zeros, etc.
        type: String,
        required: [true, 'Mobile number is required.'],
        trim: true,                                       // ADDED: Remove whitespace
        // Example match for a 10-digit number, adjust as needed for your format
        // match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number.']
        // Or for international format with optional + and country code:
        match: [/^\+?[0-9\s-]{7,15}$/, 'Please provide a valid mobile number.']
    },
    userName: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,                                     // ADDED: Ensure username is unique
        lowercase: true,                                  // ADDED: Store username in lowercase (or uppercase: true)
        trim: true,                                       // ADDED: Remove whitespace
        minlength: [3, 'Username must be at least 3 characters long.'],   // ADDED: Min length
        maxlength: [30, 'Username cannot exceed 30 characters.']  // ADDED: Max length
        // Consider a match validator for allowed characters if needed:
        // match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.']
    },
    userPassword: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [8, 'Password must be at least 8 characters long.'], // ADDED: Min length (align with express-validator)
        select: false                                     // ADDED: CRITICAL - Do not return password by default
    },
    profileImage: { // This typically stores the URL from Cloudinary
        type: String,
        required: [true, 'Profile image is required.'],
        // You might add a match validator if you want to ensure it's a valid URL format
        // match: [/^(ftp|http|https):\/\/[^ "]+$/, 'Invalid profile image URL.']
    },
}, {
    timestamps: true // ADDED: Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model("User", userSchema);