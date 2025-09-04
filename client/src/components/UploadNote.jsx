// client/src/components/UploadNote.jsx
import axios from "axios";
import React, { useState } from "react";
// import { useSelector } from "react-redux"; // Not strictly needed if userId comes from token on backend
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUpload } from "react-icons/fa";

const UploadNote = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [noteText, setNoteText] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const user = useSelector((state) => state.user.userData); // Original
  // const userId = user?._id; // Original, we will get userId from token on backend

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName("");
    }
  };

  const submitNote = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title.trim()) {
        toast.error("Please provide a title for your note.");
        setIsLoading(false);
        return;
    }
    if (!noteText.trim() && !file) {
        toast.error("Please provide either text content or upload a file.");
        setIsLoading(false);
        return;
    }

    // >>> NEW: Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
        toast.error("You must be logged in to upload a note.");
        setIsLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags); // Backend will split this comma-separated string
    formData.append("noteContent", noteText);
    // formData.append("userId", userId); // <<< REMOVE THIS LINE

    if (file) {
      formData.append("file", file); // 'file' is the key multer expects on backend
    }

    try {
      const result = await axios.post(
        "http://localhost:6969/notes/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // >>> NEW: Add Authorization header
            'Authorization': `Bearer ${token}`
          },
        }
      );
      // console.log("Note Upload Response: ", result);
      toast.success(result.data.message || "Note Uploaded Successfully!");

      setTitle("");
      setDescription("");
      setTags("");
      setNoteText("");
      setFile(null);
      setFileName("");
      if (document.getElementById("dropzone-file")) {
          document.getElementById("dropzone-file").value = "";
      }

    } catch (error) {
      console.error("Failed to submit note: ", error);
      // More detailed error handling from backend
      if (error.response && error.response.data) {
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
            // Handle express-validator errors if your /notes/upload route has them
            const firstError = error.response.data.errors[0];
            toast.error(firstError.msg || "Please check your input.");
        } else if (error.response.data.message) {
            toast.error(error.response.data.message); // e.g., "Not authorized"
        } else if (error.response.data.error) { // Backend might send { error: "message" }
            toast.error(error.response.data.error);
        }
         else {
            toast.error("Failed to upload note. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Your JSX remains the same
  return (
    <div className="flex w-full justify-center py-8 px-4 bg-gray-50">
         <ToastContainer position="top-right" autoClose={3000} />
        <form className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-md sm:p-8 space-y-5" onSubmit={submitNote}>
            {/* ... rest of your form JSX ... (no changes needed here from your provided code) */}
            <h1 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
                Create a New Note
            </h1>

            {/* Title */}
            <div>
                <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                <input
                type="text"
                id="title"
                placeholder="Note Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <input
                type="text"
                id="description"
                placeholder="Brief description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                />
            </div>

             {/* Tags */}
            <div>
                <label htmlFor="tags" className="mb-1 block text-sm font-medium text-gray-700">Tags</label>
                <input
                type="text"
                id="tags"
                placeholder="Comma-separated tags (e.g., math, calculus, chapter1)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input-field"
                />
                <p className="mt-1 text-xs text-gray-500">Helps others find your note.</p>
            </div>

            {/* Text Content */}
            <div>
                <label htmlFor="noteText" className="mb-1 block text-sm font-medium text-gray-700">Note Content</label>
                <textarea
                    id="noteText"
                    rows="6"
                    placeholder="Type your note content here..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="input-field"
                />
                 <p className="mt-1 text-xs text-gray-500">You can add text content here, or upload a file below (or both).</p>
            </div>


            {/* File Upload (PDF or Image) */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Upload File (Optional)</label>
                <label
                htmlFor="dropzone-file"
                className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                >
                <div className="flex flex-col items-center justify-center pb-6 pt-5 text-center">
                    <FaUpload className="mb-3 h-8 w-8 text-gray-400" />

                    {fileName ? (
                         <p className="text-sm text-gray-700 font-semibold">{fileName}</p>
                    ): (
                        <>
                            <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to Upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PDF, PNG, JPG, GIF</p>
                        </>
                    )}

                    <input
                    type="file"
                    id="dropzone-file"
                    accept="application/pdf, image/png, image/jpeg, image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                    />
                </div>
                </label>
            </div>

            {/* Submit Button */}
            <button
                className={`w-full rounded-lg bg-teal-500 px-5 py-2.5 text-center font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 ${isLoading ? "cursor-not-allowed opacity-75" : ""}`}
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? "Uploading..." : "Submit Note"}
            </button>
        </form>

      <style jsx>{`
        .input-field {
          display: block;
          width: 100%;
          border-radius: 0.375rem; /* rounded-md */
          border: 1px solid #d1d5db; /* border-gray-300 */
          padding: 0.625rem; /* p-2.5 */
          font-size: 0.875rem; /* text-sm */
          color: #1f2937; /* text-gray-900 */
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
        }
        .input-field:focus {
          border-color: #14b8a6; /* focus:border-teal-500 */
          outline: 2px solid transparent;
          outline-offset: 2px;
          --tw-ring-color: #14b8a6; /* focus:ring-teal-500 */
           box-shadow: 0 0 0 2px var(--tw-ring-color);
        }
      `}</style>
    </div>
  );
};

export default UploadNote;