// server/Controllers/AuthController.js
const express = require("express"); // Keeping as per your provided file
const dotenv = require("dotenv");   // Keeping
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");   // Keeping
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const fs = require('fs').promises; // For file system operations (deleting temp files)

const { validationResult } = require('express-validator');

dotenv.config(); // Keeping

const router = express.Router(); // Keeping (though unused by exported functions)

// This multer setup is redundant as the actual multer instance used by the route
// is configured and applied in server/Routes/auth.js.
// Keeping it here to minimize changes FROM YOUR PROVIDED CODE for now.
const storage = multer.memoryStorage();
var upload = multer({
    storage: storage
});

//Signup Route
const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If validation errors from express-validator, and a file was uploaded by multer, delete it.
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
                console.log("Temp profile image deleted due to express-validator errors:", req.file.path);
            } catch (unlinkError) {
                console.error("Error deleting temp profile image (express-validator err):", unlinkError);
            }
        }
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { firstName, lastName, userBio, userEmail, userMobile, userName, userPassword } = req.body;

        // Optional: Keep this application-level check for existing email,
        // or rely solely on Mongoose unique index error handling in the catch block.
        // If keeping, make sure to handle file deletion if user exists.
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            if (req.file && req.file.path) { // If file was uploaded before this check
                try { await fs.unlink(req.file.path); } catch (e) { console.error("Error deleting file for existing user check:", e); }
            }
            return res.status(409).json({ message: "An account with this email address already exists." }); // 409 Conflict
        }

        if (!req.file) {
            return res.status(400).json({ errors: [{ msg: "Profile image is required." }] }); // Consistent error format
        }

        let cloudinaryResult;
        try {
            // Assuming req.file.path is available due to diskStorage in Routes/auth.js.
            cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "campus_notes_profiles", // Good practice to organize
            });
            // console.log("Cloudinary result:", cloudinaryResult); // Your existing log
        } catch (uploadError) {
            console.error("Cloudinary upload error during signup:", uploadError);
            if (req.file && req.file.path) { // Attempt to delete local file if Cloudinary upload failed
                try { await fs.unlink(req.file.path); } catch (e) { console.error("Error deleting local file after Cloudinary fail (signup):", e); }
            }
            return res.status(500).json({ message: "Error uploading profile image to cloud." });
        }

        // Delete temporary local file after successful Cloudinary upload
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error("Error deleting temporary profile image after successful Cloudinary upload:", unlinkError);
            }
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const encryptedPassword = await bcrypt.hash(userPassword, salt);
        // console.log("Request Body for signup: ", req.body); // Your existing log

        const newUser = new User({
            firstName, lastName, userBio, userEmail, userMobile, userName,
            userPassword: encryptedPassword,
            profileImage: cloudinaryResult.secure_url
        });

        await newUser.save(); // This might throw Mongoose validation errors (unique, required, match etc.)

        // Curate response, don't send back entire Mongoose object
        const userResponse = {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            userEmail: newUser.userEmail,
            userName: newUser.userName,
            profileImage: newUser.profileImage,
        };

        return res.status(201).json({ // 201 Created for successful resource creation
            message: "User registered successfully.", // Changed from "Ok" status
            user: userResponse
        });

    } catch (error) {
        // console.log("Signup catch error:", error); // Your original log, good for seeing the raw error
        
        // --- REFINED ERROR HANDLING FOR MONGOOSE VALIDATIONS ---
        // Cleanup uploaded file if an error occurs here
        if (req.file && req.file.path) {
            try {
                await fs.access(req.file.path); // Check if file actually exists
                await fs.unlink(req.file.path);
                console.log("Temp profile image deleted due to error in signup catch block:", req.file.path);
            } catch (fsError) {
                if (fsError.code !== 'ENOENT') { // ENOENT means file not found, which is fine
                    console.error("Error in fallback file deletion (signup catch):", fsError);
                }
            }
        }

        // 1. Handle MongoDB Duplicate Key Errors (for 'unique: true' fields)
        if (error.code === 11000) {
            let field = Object.keys(error.keyValue)[0];
            let fieldValue = error.keyValue[field];
            // Make field name more readable
            let readableField = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            
            return res.status(409).json({ // 409 Conflict
                // Send as an array of errors, similar to express-validator, for consistency on frontend
                errors: [{
                    type: "field",
                    msg: `${readableField} '${fieldValue}' is already taken. Please choose another one.`,
                    path: field, // original field name
                    location: "body"
                }]
            });
        }

        // 2. Handle Mongoose Validation Errors (required, minlength, maxlength, match, enum)
        if (error.name === 'ValidationError') {
            let errorsArray = [];
            Object.keys(error.errors).forEach((key) => {
                errorsArray.push({
                    type: "field",
                    value: error.errors[key].value,
                    msg: error.errors[key].message,
                    path: key,
                    location: "body"
                });
            });
            return res.status(400).json({ errors: errorsArray });
        }

        // 3. Your Original Generic Error Fallback / Other Server Errors
        console.error("Unhandled Signup Error:", error); // Log unhandled errors
        return res.status(500).json({ message: error.message || "Server error during registration." });
    }
};

//Login Route
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { userEmail, userPassword } = req.body;

        // >>> IMPORTANT: Add .select('+userPassword') because it's select:false in schema <<<
        const user = await User.findOne({ userEmail }).select('+userPassword');

        if (!user) { // Check if user exists first
            return res.status(404).json({ message: "User not found." }); // Changed from your original for clarity
        }

        // If user exists, user.userPassword will now be available for comparison
        const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
        if (passwordMatch) {
            const payload = {
                user: {
                    id: user._id, // Use _id from Mongoose
                    email: user.userEmail,
                    userName: user.userName // Good to include for display purposes
                },
            };
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } // Using '1d' as a more common default
            );

            // Curate user response
            const userResponse = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                userEmail: user.userEmail,
                userName: user.userName,
                profileImage: user.profileImage
            };

            return res.status(200).json({
                message: "Login successful.", // Changed from "Ok" status
                token,
                user: userResponse
            });
        } else {
            return res.status(401).json({ message: "Invalid credentials." }); // Changed from your original for clarity
        }

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error during login." }); // Changed from your original for clarity
    }
};

module.exports = { signup, login };