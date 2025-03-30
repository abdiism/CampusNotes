import axios from "axios";
import React, { useState } from "react";
// Import necessary icons
import { FaSearch, FaTrashAlt, FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Ensure Close icon is imported
import { useSelector } from "react-redux";
// Optional: Import toast for notifications
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// --- Modal Component ---
// Displays the full details of the selected note
const NoteModal = ({ note, onClose }) => {
  if (!note) return null;

  // Helper function to open file link - Defined inside modal
  const viewFile = (fileIdentifier) => {
      if (fileIdentifier && (fileIdentifier.startsWith('http://') || fileIdentifier.startsWith('https://'))) {
          window.open(fileIdentifier, "_blank", "noreferrer");
      } else if (fileIdentifier) {
          // Make sure this path matches your backend static serving route
          window.open(`http://localhost:6969/files/${fileIdentifier}`, "_blank", "noreferrer");
      } else {
           console.warn("viewFile called with invalid identifier:", fileIdentifier);
      }
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300">
      {/* Modal Panel */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 relative transform transition-all duration-300 scale-95 opacity-0 animate-modal-scale-in">
        {/* Close Button: Uses onClose prop passed from SearchBar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-blue-400 hover:text-blue-600 text-3xl font-light leading-none"
          aria-label="Close modal"
        >
          <IoClose /> {/* Using Close Icon */}
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3 pr-8">{note.fileName}</h2>
        {note.fileDescription && (
            <p className="text-sm text-gray-700 mb-4">{note.fileDescription}</p>
        )}
         {note.noteContent && (
            <p className="text-base text-gray-800 whitespace-pre-wrap mb-4">
                {note.noteContent}
            </p>
         )}
         {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-blue-100">
              {note.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
         {/* View Attached File Button: Uses viewFile function defined above */}
         {(note.imageUrl || note.files) && (
            <div className={`pt-4 ${note.tags && note.tags.length > 0 ? 'mt-4 border-t border-blue-100' : ''}`}>
                <button
                    onClick={() => viewFile(note.imageUrl || note.files)}
                    className="inline-flex items-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                >
                    View Attached File
                </button>
            </div>
          )}
      </div>
      {/* Animation Style */}
      <style jsx global>{`
        @keyframes modal-scale-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-scale-in { animation: modal-scale-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};


// --- Helper function viewFile (can be defined outside if used elsewhere too) ---
// const viewFile = (fileIdentifier) => { ... }; // Already defined inside Modal now


// --- Main SearchBar Component ---
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("Idle");
  const [searchError, setSearchError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedNoteForModal, setSelectedNoteForModal] = useState(null);
  // Removing delete state/logic for now to focus on modal buttons
  // const [deletingNoteId, setDeletingNoteId] = useState(null);

  const user = useSelector((state) => state.user.userData);

  const handleSearch = async (e) => {
      e.preventDefault(); if (!searchQuery.trim()) return; setSearchStatus("Loading"); setSearchResults([]); setSearchError(""); setShowModal(false); setSelectedNoteForModal(null); try { const response = await axios.get("http://localhost:6969/notes/getFiles", { params: { title: searchQuery }, }); if (response.data?.data?.length > 0) { setSearchResults(response.data.data); setSearchStatus("Found"); } else { setSearchResults([]); setSearchStatus("Not-Found"); } } catch (error) { console.error("Error Fetching Notes: ", error); setSearchError(error.response?.data?.message || "Failed to fetch notes. Please try again."); setSearchStatus("Error"); }
  };

  // This function increments view count AND opens modal
  const handleOpenNote = (note) => {
    setSelectedNoteForModal(note);
    setShowModal(true);
    axios.patch(`http://localhost:6969/notes/${note._id}/view`)
      .then(response => { console.log("View count updated triggered"); })
      .catch(error => { console.error("Error incrementing view count:", error); });
  };

  // This function closes the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNoteForModal(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) { return dateString; }
  };

  // Removed handleDelete function for now

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-4 sm:p-6">
      {/* Search Form Container */}
      <div className="w-full max-w-3xl mb-6">
         <form className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm flex items-center space-x-3" onSubmit={handleSearch}> <FaSearch className="text-xl text-blue-400" /> <input type="search" placeholder="Search Notes by Title..." className="flex-grow bg-white text-gray-900 placeholder-gray-500 focus:outline-none text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /> <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:opacity-70" disabled={searchStatus === "Loading"}> {searchStatus === "Loading" ? "..." : "Search"} </button> </form>
      </div>

      {/* Search Results Area */}
      <div className="w-full max-w-5xl">
        {/* Loading/Error/Not Found States */}
        {searchStatus === "Loading" && ( <div className="text-center text-blue-700 py-10">Searching...</div> )} {searchStatus === "Error" && ( <div className="text-center text-red-600 bg-red-100 border border-red-300 rounded p-4 mb-4"><p><strong>Error:</strong> {searchError}</p></div> )} {searchStatus === "Not-Found" && !showModal && searchResults.length === 0 && ( <div className="text-center text-gray-600 py-10">No Notes Found Matching Your Query.</div> )}

        {/* Grid Layout */}
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((note) => (
              <div key={note._id} className="flex flex-col justify-between rounded-lg bg-white p-4 shadow border border-blue-100 hover:shadow-md transition-shadow duration-200 space-y-3 h-full">
                {/* Summary Area */}
                <div className="flex-grow"> <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate" title={note.fileName}>{note.fileName}</h3> {note.fileDescription && (<p className="text-sm text-gray-600 mb-2 line-clamp-2">{note.fileDescription}</p>)} {note.tags && note.tags.length > 0 && ( <div className="flex flex-wrap gap-1 mb-3"> {note.tags.map((tag, index) => ( <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span> ))} </div> )} </div>
                {/* Action Button & Uploader Info Area */}
                <div className="flex items-center justify-between border-t border-blue-100 pt-3 mt-auto">
                   {/* Uploader Info & View Count */}
                   <div className="text-xs text-gray-500 space-y-0.5"> {note.uploadedBy?.userName ? (<p className="truncate" title={`Uploaded by ${note.uploadedBy.userName}`}>By: {note.uploadedBy.userName}</p>) : (<p>By: Unknown</p>)} {note.createdAt && (<p>On: {formatDate(note.createdAt)}</p>)} <p className="flex items-center" title={`${note.viewCount ?? 0} views`}> <FaEye className="w-3 h-3 mr-1 inline-block" /> {note.viewCount ?? 0} </p> </div>
                   {/* Action Buttons Group */}
                   <div className="flex space-x-2 flex-shrink-0">
                       {/* Open Note Button */}
                       <button onClick={() => handleOpenNote(note)} className="rounded-md bg-blue-500 p-1.5 text-xs font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" title="Open Note"> Open </button>
                       {/* Delete Button REMOVED for focus */}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Rendered Here, passing handleCloseModal as onClose */}
      {showModal && <NoteModal note={selectedNoteForModal} onClose={handleCloseModal} />}

    </div>
  );
};

export default SearchBar;