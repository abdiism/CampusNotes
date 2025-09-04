// server/Controllers/NotesController.js
const Notes = require("../Models/Notes");
// const cloudinary = require('cloudinary').v2; // Not needed for uploadNote if storing locally
// const fs = require('fs').promises;         // Not needed for uploadNote if multer handles file and we only store filename

// Helper function to escape special characters for regular expressions
function escapeRegex(string) {
  if (typeof string !== 'string' || string.trim() === '') {
    return '';
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Cloudinary configuration (kept here if other functions like deleteNote might use it,
// but not directly used by the reverted uploadNote for saving)
const cloudinary = require('cloudinary').v2;
if (!cloudinary.config().cloud_name) {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
        console.log("Cloudinary configured via NotesController (for potential other uses like delete).");
    } catch (configError) {
        console.error("Cloudinary configuration error in NotesController:", configError);
    }
}


// REVERTED uploadNote to use local file storage (filename from multer)
// and use req.user.id for uploadedBy
const uploadNote = async (req, res) => {
    try {
        // Get userId from authenticated token (from protect middleware)
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated." });
        }
        const authenticatedUserId = req.user.id;

        const title = req.body.title; // From frontend (was fileName in your backup, assuming frontend sends title)
        const description = req.body.description;
        const tagsInput = req.body.tags || '';
        const noteContent = req.body.noteContent || '';

        // Get the filename from multer, which should have saved it locally
        // This relies on Routes/notes.js having multer with diskStorage configured
        const localFileIdentifier = req.file ? req.file.filename : null;

        // console.log("--- Uploading Note (Local File Method) ---");
        // console.log("Local filename from multer:", localFileIdentifier);

        const tagsArray = tagsInput.split(',')
                                .map(tag => tag.trim())
                                .filter(tag => tag !== '');

        const newNoteData = {
            fileName: title, // Your NoteSchema uses fileName
            fileDescription: description, // Your NoteSchema uses fileDescription
            tags: tagsArray,
            noteContent: noteContent,
            files: localFileIdentifier, // Store the local filename (or null if no file)
            uploadedBy: authenticatedUserId // Use ID from token
        };

        const newNote = new Notes(newNoteData);
        await newNote.save();
        // console.log("--- Note Saved (Referencing Local File) ---");
        res.status(201).send({ status: "Ok", message: "Note uploaded successfully!", data: newNote });

    } catch (error) {
        console.error("Error in uploadNote (local storage approach):", error);
        // Note: If an error occurs here, the file uploaded by multer to the local disk
        // might need manual cleanup or a more robust error handling in the multer setup itself.
        res.status(400).json({ error: "Failed to upload note", details: error.message });
    }
};

// getNote function for searching ALL notes by title OR tag
// (Authenticated access is still required by the 'protect' middleware on the route)
const getNote = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        let query = {};

        if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== "") {
            const escapedSearchTerm = escapeRegex(searchTerm.trim());
            if (escapedSearchTerm) {
                const searchRegex = { $regex: escapedSearchTerm, $options: "i" };
                query = { // Assign to query directly if searchTerm exists
                    $or: [
                        { fileName: searchRegex },
                        { tags: searchRegex }
                    ]
                };
            }
        }
        // If no searchTerm or empty, query remains {}, finding all notes.

        // console.log("Executing PUBLIC Search DB Query for getNote:", JSON.stringify(query, null, 2));

        const data = await Notes.find(query)
                                .populate('uploadedBy', 'userName profileImage')
                                .sort({ createdAt: -1 });

        // console.log("Public Search Query Result Count for getNote:", data.length);
        res.send({ status: "Ok", data: data });

    } catch (error) {
        console.error("Error in getNote (public search):", error);
        res.status(500).json({ status: "Error", message: 'Failed to fetch notes', details: error.message });
    }
};

// YOUR EXISTING getNoteByUserId (from your backup, I renamed it from getNoteByID for clarity with express params)
// This should fetch notes for a specific user ID given in params,
// but for security, it should ideally check if the logged-in user is authorized to see them,
// or be intended for a specific use case like public profiles.
// The version you provided earlier (getNoteByUserId) already used req.user.id, which is better.
// I will use the version that uses req.user.id.
const getNoteByUserId = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ status: "Error", message: "Not authorized or user ID missing from token" });
        }
        const authenticatedUserId = req.user.id;
        // console.log("Fetching notes for authenticated user ID (getNoteByUserId):", authenticatedUserId);

        const data = await Notes.find({ uploadedBy: authenticatedUserId })
                                .populate('uploadedBy', 'userName profileImage')
                                .sort({ createdAt: -1 });

        res.send({ status: "Ok", data: data });

    } catch (error) {
        console.error("Error in getNoteByUserId:", error);
        res.status(500).json({ status: "Error", message: 'Failed to fetch user notes', details: error.message });
    }
};


// YOUR EXISTING deleteNote (with authorization check using req.user.id)
const deleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json({ status: "Error", message: "Note not found" });
        }

        if (!req.user || !req.user.id || note.uploadedBy.toString() !== req.user.id) {
             return res.status(403).json({ status: "Error", message: "User not authorized to delete this note" });
        }

        await Notes.findByIdAndDelete(id);
        // If you were serving files locally and want to delete them from server disk:
        // if (note.files) {
        //     const fs = require('fs').promises;
        //     const path = require('path');
        //     const filePath = path.join(__dirname, '..', 'uploads_notes', note.files); // Adjust path as needed
        //     try {
        //         await fs.unlink(filePath);
        //         console.log("Deleted local file:", filePath);
        //     } catch (fileError) {
        //         console.error("Error deleting local file during note deletion:", fileError);
        //     }
        // }
        res.status(200).json({ status: "Ok", message: "Note deleted successfully" });

    } catch (error) {
        console.error("Error in deleteNote:", error);
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ status: "Error", message: "Invalid Note ID format" });
        }
        res.status(500).json({ status: "Error", message: 'Failed to delete note', details: error.message });
    }
};

// YOUR EXISTING incrementViewCount
const incrementViewCount = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedNote = await Notes.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ status: "Error", message: "Note not found" });
        }
        res.status(200).json({ status: "Ok", message: "View count updated", newViewCount: updatedNote.viewCount });
    } catch (error) {
        console.error("Error incrementing view count:", error);
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ status: "Error", message: "Invalid Note ID format" });
        }
        res.status(500).json({ status: "Error", message: 'Failed to update view count', details: error.message });
    }
};

module.exports = {
    uploadNote,
    getNote,
    getNoteByUserId, // Using the one that takes ID from req.user
    deleteNote,
    incrementViewCount
};