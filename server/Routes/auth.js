// server/Routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../Controllers/AuthController");
const multer = require("multer");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

// >>> NEW: Import 'body' from express-validator
const { body } = require('express-validator');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = "./images"; // Ensure this directory exists
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

var upload = multer({
    storage: storage
});


// >>> NEW: Define Validation Rules for Signup
const signupValidationRules = () => {
    return [
        body('firstName')
            .trim()
            .notEmpty().withMessage('First name is required.')
            .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters.'),
        body('lastName')
            .trim()
            .notEmpty().withMessage('Last name is required.')
            .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters.'),
        body('userName')
            .trim()
            .notEmpty().withMessage('Username is required.')
            .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters.')
            .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores.'),
        body('userEmail')
            .trim()
            .notEmpty().withMessage('Email is required.')
            .isEmail().withMessage('Please provide a valid email address.')
            .normalizeEmail(),
        body('userPassword')
            .notEmpty().withMessage('Password is required.')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
            .matches(/[0-9]/).withMessage('Password must contain at least one number.')
            .matches(/[\W_]/).withMessage('Password must contain at least one symbol (e.g., !@#$%^&*).'), // \W for non-alphanumeric, _ for underscore
        body('userBio')
            .optional({ checkFalsy: true }) // Skips validation if value is '', null, undefined, 0, false
            .trim()
            .isLength({ max: 250 }).withMessage('Bio cannot be more than 250 characters.'),
        body('userMobile')
            .optional({ checkFalsy: true })
            .trim()
            .matches(/^\+?[0-9\s-]{7,15}$/).withMessage('Please provide a valid mobile number format.') // Basic mobile format
    ];
};

// >>> NEW: Define Validation Rules for Login
const loginValidationRules = () => {
    return [
        body('userEmail')
            .trim()
            .notEmpty().withMessage('Email is required.')
            .isEmail().withMessage('Please provide a valid email address.')
            .normalizeEmail(),
        body('userPassword')
            .notEmpty().withMessage('Password is required.')
    ];
};

// Signup
// >>> UPDATED: Added signupValidationRules() middleware
router.post(
    "/signup",
    upload.single("profileImage"), // Multer middleware for file upload
    signupValidationRules(),       // Validation middleware
    authController.signup          // Controller
);

// Login
// >>> UPDATED: Added loginValidationRules() middleware
router.post(
    "/login",
    loginValidationRules(),        // Validation middleware
    authController.login           // Controller
);

module.exports = router;