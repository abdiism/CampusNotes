const express = require("express");
const router = express.Router();
const NotesController = require("../Controllers/NotesController");
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
router.post("/upload", upload.single("file"), NotesController.uploadNote);

// Get Notes (for search, expects query params like ?title=...)
// Assuming your frontend GETs from /notes/getFiles for search
router.get("/getFiles", NotesController.getNote);

// Get Notes by User ID (for profile page)
// Assuming your frontend GETs from /notes/getFiles/:id for profile
router.get("/getFiles/:id", NotesController.getNoteByID);

// --- ADD THIS LINE FOR DELETE ---
// Handles DELETE requests like /notes/some_object_id
router.delete("/:id", NotesController.deleteNote);

router.patch("/:id/view", NotesController.incrementViewCount);


module.exports = router;