const express = require("express");
const dotenv = require("dotenv");
const Notes = require("../Models/Notes"); // Ensure path is correct
const multer = require("multer");
const path = require("path");

dotenv.config();

const storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// Helper function to escape special characters for regular expressions
function escapeRegex(string) {
  if (typeof string !== 'string') {
    return '';
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


const uploadNote = async (req, res) => {
    try {
        const fileName = req.body.title;
        const fileDescription = req.body.description;
        const tagsInput = req.body.tags || '';
        // Assuming you might use Cloudinary later or need file info differently
        // Adjust how 'file' is handled based on your setup (Cloudinary URL vs filename)
        const fileIdentifier = req.file ? req.file.filename : null; // Or Cloudinary URL if integrated
        const uploadedBy = req.body.userId;
        const noteContent = req.body.noteContent || '';

        console.log("--- Uploading Note ---");
        // console.log("Raw Tags Input:", tagsInput); // Keep logs for debugging if needed
        // console.log("Note Content Input:", noteContent);

        const tagsArray = tagsInput.split(',')
                                .map(tag => tag.trim())
                                .filter(tag => tag !== '');

        // console.log("Processed Tags Array:", tagsArray);

        const newNoteData = { // Changed variable name slightly
            fileName: fileName,
            fileDescription: fileDescription,
            tags: tagsArray,
            noteContent: noteContent,
            // Save 'imageUrl' or 'files' based on your schema (assuming 'files' for now)
            files: fileIdentifier, // Make sure 'files' or 'imageUrl' matches your schema field
            uploadedBy: uploadedBy
        };

        const newNote = new Notes(newNoteData); // Create instance

        // console.log("Document to be saved:", JSON.stringify(newNote, null, 2));

        await newNote.save();
        console.log("--- Note Saved ---");
        res.status(201).send({ status: "Ok", message: "Note uploaded successfully", data: newNote }); // Send 201 Created status

    } catch (error) {
        console.error("Error in uploadNote:", error);
        res.status(400).json({ error: "Failed to upload note", details: error.message });
    }
};

// Function used for searching notes (e.g., by title/tag)
const getNote = async (req, res) => {
    try {
        const { title, tag } = req.query;
        const query = {};

        if (title) {
            const escapedTitle = escapeRegex(title);
            query.fileName = { $regex: escapedTitle, $options: "i" };
        };

        if (tag) {
            const searchTag = tag.trim();
            if (searchTag) {
                 query.tags = searchTag; // Assumes 'tags' is an array field in your schema
            }
        };

        console.log("Executing DB Query with Populate:", JSON.stringify(query, null, 2));

        // --- Modification: Added .populate() and .sort() ---
        const data = await Notes.find(query)
                                .populate('uploadedBy', 'userName') // Gets User info, only selecting userName field
                                .sort({ createdAt: -1 }); // Optional: Sorts newest first
        // --- End Modification ---

        console.log("Query Result Count:", data.length);
        // Ensure the response structure matches what frontend expects e.g., { data: data }
        res.send({ status: "Ok", data: data });

    } catch (error) {
        console.error("Error in getNote:", error); // Use console.error
        res.status(500).json({ status: "Error", error: 'Failed to fetch notes', details: error.message });
    }
};


// Function to get notes by User ID (e.g., for a profile page)
// Also add populate here if you need user info when fetching by ID
const getNoteByID = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("Fetching notes for user ID:", userId);

        // --- Modification: Add .populate() and .sort() here too if needed ---
        const data = await Notes.find({ uploadedBy: userId })
                                .populate('uploadedBy', 'userName') // Populate user info
                                .sort({ createdAt: -1 }); // Optional sort
        // --- End Modification ---

        // Ensure the response structure matches what frontend expects e.g., { data: data }
        res.send({ status: "Ok", data: data });

    } catch (error) {
        console.error("Error in getNoteByID:", error); // Use console.error
        res.status(500).json({ status: "Error", error: 'Failed to fetch notes by ID', details: error.message });
    }
};

const deleteNote = async (req, res) => {
    const { id } = req.params; // Get the note ID from the URL parameter

    try {
        // Find the note first to ensure it exists
        const note = await Notes.findById(id);

        if (!note) {
            return res.status(404).json({ status: "Error", message: "Note not found" });
        }

        // --- Optional but Recommended: Authorization Check ---
        // Check if the logged-in user is the one who uploaded the note.
        // This assumes you have authentication middleware that adds user info to req, e.g., req.user.id
        /*
        if (!req.user || note.uploadedBy.toString() !== req.user.id) {
             return res.status(403).json({ status: "Error", message: "User not authorized to delete this note" });
        }
        */
        // --- End Optional Authorization Check ---

        // If the note exists (and optionally, user is authorized), delete it
        await Notes.findByIdAndDelete(id);

        res.status(200).json({ status: "Ok", message: "Note deleted successfully" });

    } catch (error) {
        console.error("Error in deleteNote:", error);
        // Handle potential errors like invalid ID format
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ status: "Error", message: "Invalid Note ID format" });
        }
        res.status(500).json({ status: "Error", error: 'Failed to delete note', details: error.message });
    }
};
const incrementViewCount = async (req, res) => {
    const { id } = req.params; // Get note ID from URL

    try {
        // Find the note by ID and atomically increment viewCount by 1
        // { new: true } option returns the updated document (optional)
        const updatedNote = await Notes.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } }, // Use $inc to increment
            { new: true } // Return the modified document
        );

        if (!updatedNote) {
            // If note wasn't found with that ID
            return res.status(404).json({ status: "Error", message: "Note not found" });
        }

        // Successfully incremented. Send back minimal response or updated note.
        // Sending just success is often enough for this kind of action.
        res.status(200).json({ status: "Ok", message: "View count updated", newViewCount: updatedNote.viewCount });

    } catch (error) {
        console.error("Error incrementing view count:", error);
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ status: "Error", message: "Invalid Note ID format" });
        }
        res.status(500).json({ status: "Error", error: 'Failed to update view count', details: error.message });
    }
};

// Ensure all needed functions are exported
module.exports = { uploadNote, getNote, getNoteByID , deleteNote , incrementViewCount };