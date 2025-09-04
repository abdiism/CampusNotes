// server/index.js
const dotenv = require("dotenv");
dotenv.config(); // Load .env variables first

const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet"); // For security headers
const rateLimit = require("express-rate-limit"); // For rate limiting

const authRoutes = require("./Routes/auth");
const noteRoutes = require("./Routes/notes");

const app = express();
const PORT = process.env.PORT || 6969;

// --- Core Middlewares ---
app.use(helmet()); // Apply security headers
app.use(cors());   // Enable CORS (consider stricter config for production)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// --- Rate Limiting for Authentication Routes ---
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs to /auth routes
    message: { status: "Error", message: "Too many authentication attempts, please try again after 15 minutes." },
    standardHeaders: true, // Send standard rate limit headers
    legacyHeaders: false,  // Don't send X-RateLimit-* headers
});

// --- Static File Serving ---
// This serves files from a directory named 'files' at the root of your 'server' project.
// For example, a request to /files/myimage.jpg will serve server/files/myimage.jpg
app.use("/files", express.static("files"));

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connection Successful"))
    .catch((error) => console.error("MongoDB Connection Error:", error));

// --- Routes ---
app.get("/", (req, res) => {
    res.send("Server Is Running");
});

// Apply the authLimiter ONLY to /auth routes
app.use("/auth", authLimiter, authRoutes);

// Other routes (not applying specific rate limiter here for now, but you could)
app.use("/notes", noteRoutes);


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});