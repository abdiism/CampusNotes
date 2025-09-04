// client/src/components/SearchBar.jsx
import axios from "axios";
import React, { useState } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
// import { useSelector } from "react-redux"; // Not directly needed in SearchBar for user data, but good for auth status if you check here
import { toast } from 'react-toastify'; // Assuming you might want to use toast for errors

// --- Modal Component (Keep as is) ---
const NoteModal = ({ note, onClose }) => {
  if (!note) return null;
  const viewFile = (fileIdentifier) => {
      if (fileIdentifier && (fileIdentifier.startsWith('http://') || fileIdentifier.startsWith('https://'))) {
          window.open(fileIdentifier, "_blank", "noreferrer");
      } else if (fileIdentifier) {
          window.open(`http://localhost:6969/files/${fileIdentifier}`, "_blank", "noreferrer");
      }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 relative transform transition-all duration-300 scale-100 opacity-100">
        <button onClick={onClose} className="absolute top-3 right-4 text-blue-400 hover:text-blue-600 text-3xl font-light leading-none" aria-label="Close modal"><IoClose /></button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3 pr-8">{note.fileName}</h2>
        {note.fileDescription && (<p className="text-sm text-gray-700 mb-4">{note.fileDescription}</p>)}
        {note.noteContent && (<p className="text-base text-gray-800 whitespace-pre-wrap mb-4">{note.noteContent}</p>)}
        {note.tags && note.tags.length > 0 && ( <div className="flex flex-wrap gap-2 pt-4 border-t border-blue-100"> {note.tags.map((tag, index) => (<span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>))} </div> )}
        {(note.imageUrl || note.files) && ( <div className={`pt-4 ${note.tags && note.tags.length > 0 ? 'mt-4 border-t border-blue-100' : ''}`}> <button onClick={() => viewFile(note.imageUrl || note.files)} className="inline-flex items-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1">View Attached File</button> </div> )}
      </div>
    </div>
  );
};


// --- Main SearchBar Component ---
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("Idle"); // "Idle", "Loading", "Found", "Not-Found", "Error"
  const [searchError, setSearchError] = useState(""); // Store error message string
  const [showModal, setShowModal] = useState(false);
  const [selectedNoteForModal, setSelectedNoteForModal] = useState(null);

  // const user = useSelector((state) => state.user.userData); // You can use this if needed for other things

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
        setSearchResults([]); // Clear results if search query is empty
        setSearchStatus("Idle");
        return;
    }
    setSearchStatus("Loading");
    setSearchResults([]);
    setSearchError("");
    // setShowModal(false); // Not needed here, modal is separate
    // setSelectedNoteForModal(null); // Not needed here

    // >>> NEW: Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
        setSearchError("Authentication token not found. Please log in again.");
        setSearchStatus("Error");
        toast.error("You are not authorized to perform this search. Please log in.");
        // Optionally, redirect to login: navigate('/login'); (if useNavigate is imported and used)
        return;
    }

    try {
      const response = await axios.get(
        "http://localhost:6969/notes/getFiles", // Your backend endpoint
        {
          params: { searchTerm: searchQuery.trim() },
          // >>> NEW: Added Authorization header
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.data && response.data.data.length > 0) {
        setSearchResults(response.data.data);
        setSearchStatus("Found");
      } else {
        setSearchResults([]);
        setSearchStatus("Not-Found");
      }
    } catch (error) {
      console.error("Error Fetching Notes: ", error);
      // Use the specific error message from the backend if available
      const backendErrorMessage = error.response?.data?.message;
      const displayError = backendErrorMessage || "Failed to fetch notes. Please try again.";
      
      setSearchError(displayError); // Set the error message to be displayed
      setSearchStatus("Error");
      
      // Show a toast for better user feedback
      if (backendErrorMessage) {
          toast.error(backendErrorMessage); // e.g., "Not authorized, no token"
      } else {
          toast.error("An error occurred while fetching notes.");
      }
    }
  };

  const handleOpenNote = (note) => {
    setSelectedNoteForModal(note);
    setShowModal(true);
    
    // >>> NEW: Retrieve token for PATCH request
    const token = localStorage.getItem('authToken');
    // We should ideally only send this request if logged in, but backend will protect it.
    // If you want to prevent the call entirely if no token:
    // if (!token) { console.warn("No token for view count increment"); return; }
    
    axios.patch(
        `http://localhost:6969/notes/${note._id}/view`,
        {}, // Empty body for PATCH if no data is sent
        {   // >>> NEW: Add Authorization header if your view increment endpoint is protected
            headers: {
                'Authorization': `Bearer ${token}` 
                // Add this header IF your /notes/:id/view endpoint is also protected
                // If it's a public action, this header is not needed for this specific call.
            }
        }
      )
      .then(response => {
         // Successfully updated view count, no need to do much on frontend
         // You might want to update the viewCount in your local searchResults state if backend returns updated note
      })
      .catch(error => {
        console.error("Error incrementing view count:", error);
        // Optionally show a non-intrusive error if view count update fails
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNoteForModal(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateDateString(undefined, options); // Corrected method name
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-4 sm:p-6">
      {/* Search Form */}
      <div className="w-full max-w-3xl mb-6">
        <form className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm flex items-center space-x-3" onSubmit={handleSearch}>
            <FaSearch className="text-xl text-blue-400" />
            <input
                type="search"
                placeholder="Search Notes by Title..."
                className="flex-grow bg-white text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
                type="submit"
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:opacity-70"
                disabled={searchStatus === "Loading"}
            >
                {searchStatus === "Loading" ? "..." : "Search"}
            </button>
        </form>
      </div>

      {/* Results Area */}
      <div className="w-full max-w-5xl">
        {searchStatus === "Loading" && ( <div className="text-center text-blue-700 py-10">Searching...</div> )}
        {/* Updated error display to use searchError state */}
        {searchStatus === "Error" && ( <div className="text-center text-red-600 bg-red-100 border border-red-300 rounded p-4 mb-4"><p><strong>Error:</strong> {searchError}</p></div> )}
        {searchStatus === "Not-Found" && searchResults.length === 0 && ( <div className="text-center text-gray-600 py-10">No Notes Found Matching Your Query.</div> )}

        {searchStatus === "Found" && searchResults.length > 0 && ( // Only show results if status is "Found"
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((note) => (
              <div key={note._id} className="flex flex-col justify-between rounded-lg bg-white p-4 shadow border border-blue-100 hover:shadow-md transition-shadow duration-200 space-y-3 h-full">
                <div className="flex-grow">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate" title={note.fileName}>{note.fileName}</h3>
                    {note.fileDescription && (<p className="text-sm text-gray-600 mb-2 line-clamp-2">{note.fileDescription}</p>)}
                    {note.tags && note.tags.length > 0 && ( <div className="flex flex-wrap gap-1 mb-3"> {note.tags.map((tag, index) => ( <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span> ))} </div> )}
                </div>
                <div className="flex items-end justify-between border-t border-blue-100 pt-3 mt-auto">
                   <div className="text-xs text-gray-500 space-y-0.5">
                       {note.uploadedBy?.userName ? (<p className="truncate" title={`Uploaded by ${note.uploadedBy.userName}`}>By: {note.uploadedBy.userName}</p>) : (<p>By: Unknown</p>)}
                       {note.createdAt && (<p>On: {formatDate(note.createdAt)}</p>)}
                       <p className="flex items-center pt-0.5" title={`${note.viewCount ?? 0} views`}> <FaEye className="w-3 h-3 mr-1 inline-block text-blue-400" /> {note.viewCount ?? 0} </p>
                   </div>
                   <div className="flex space-x-2 flex-shrink-0">
                       <button onClick={() => handleOpenNote(note)} className="rounded-md bg-blue-500 p-1.5 text-xs font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" title="Open Note"> Open </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <NoteModal note={selectedNoteForModal} onClose={handleCloseModal} />}
    </div>
  );
};

export default SearchBar;