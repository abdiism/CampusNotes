const express = require("express");
const router = express.Router();
const NotesController = require("../Controllers/NotesController");
const { protect } = require('../Middleware/authMiddleware'); // Import the protect middleware
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = "./files"; // Consider making this configurable
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({ storage: storage });

// --- Routes ---

// Create Note (handles file upload)
// Assuming your frontend POSTs to /notes/upload
router.post("/upload", protect, upload.single("file"), NotesController.uploadNote);

// Get Notes (for search, expects query params like ?title=...)
// Assuming your frontend GETs from /notes/getFiles for search
router.get("/getFiles", protect, NotesController.getNote);

// Get Notes by User ID (for profile page)
// Assuming your frontend GETs from /notes/getFiles/:id for profile
// This route might need adjustment. If ':id' is the user ID, and you get user from token,
// you might not need ':id' in the path, or it's used differently.
// For now, protecting it. The controller will need to use req.user.id.
router.get("/getFilesByUserId", protect, NotesController.getNoteByUserId); // Renamed for clarity, assuming it gets notes for the LOGGED IN user.
// If you still need to get notes by a specific user ID (e.g., for public profiles), that would be a different route or logic.
// router.get("/getFiles/:id", protect, NotesController.getNoteByID); // Original route, if needed for other purposes

// --- ADD THIS LINE FOR DELETE ---
// Handles DELETE requests like /notes/some_object_id
router.delete("/:id", protect, NotesController.deleteNote);

// Increment view count - consider if this needs auth. If anyone can view, no 'protect'.
// If only logged-in users' views are counted or if viewing is restricted, then add 'protect'.
// For now, let's assume viewing is public but actions are protected.
router.patch("/:id/view", NotesController.incrementViewCount);


module.exports = router;