import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
// Optional: Import toast for notifications
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// --- viewFile Helper Function ---
const viewFile = (fileIdentifier) => {
    if (fileIdentifier && (fileIdentifier.startsWith('http://') || fileIdentifier.startsWith('https://'))) {
        window.open(fileIdentifier, "_blank", "noreferrer");
    } else if (fileIdentifier) {
        window.open(`http://localhost:6969/files/${fileIdentifier}`, "_blank", "noreferrer");
    } else {
        console.warn("viewFile called with invalid identifier:", fileIdentifier);
        // toast.error("Cannot view file: Invalid file identifier.");
    }
};

// --- Delete Confirmation Modal Component ---
const DeleteConfirmModal = ({ note, onConfirm, onCancel, isDeleting }) => {
    if (!note) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300 scale-95 opacity-0 animate-modal-scale-in">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Deletion</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete the note titled: <br />
                    <strong className="font-medium text-gray-900">"{note.fileName}"</strong>?
                    <br /> This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(note._id)}
                        disabled={isDeleting}
                        className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 ${isDeleting ? 'cursor-not-allowed' : ''}`}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
            {/* Animation Style */}
            <style jsx global>{`
              @keyframes modal-scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
              .animate-modal-scale-in { animation: modal-scale-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};
// --- End Delete Confirmation Modal ---


const Profile = () => {
  const user = useSelector((state) => state.user.userData);
  const [userFiles, setUserFiles] = useState([]);
  const [error, setError] = useState('');

  // --- State for Delete Confirmation ---
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // --- End Delete Confirmation State ---

  const userId = user?._id;

  // --- useEffect to fetch user files ---
  useEffect(() => {
    const getUserFiles = async () => {
      if (!userId) return;
      setError('');
      setUserFiles([]); // Clear before fetch
      try {
        const result = await axios.get(`http://localhost:6969/notes/getFiles/${userId}`);
        if (result.data?.data && Array.isArray(result.data.data)) {
            setUserFiles(result.data.data);
        } else {
            console.log("API response did not contain expected data array.");
            setUserFiles([]);
        }
      } catch (err) {
          console.error("Error fetching user files:", err);
          setError(err.response?.data?.message || "Failed to load documents.");
          setUserFiles([]);
      }
    };
    getUserFiles();
  }, [userId]);


  // --- Delete Handling Functions ---
  const promptDeleteConfirmation = (note) => {
    setNoteToDelete(note);
    setShowDeleteConfirmModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setNoteToDelete(null);
  };

  const confirmDelete = async (noteIdToDelete) => {
    setIsDeleting(true);
    setError('');
    try {
      const response = await axios.delete(`http://localhost:6969/notes/${noteIdToDelete}`);
      console.log(response.data.message);
      // toast.success(response.data.message || "Document deleted successfully!");
      setUserFiles(prevFiles =>
        prevFiles.filter(file => file._id !== noteIdToDelete)
      );
      setShowDeleteConfirmModal(false);
      setNoteToDelete(null);
    } catch (err) {
      console.error("Error deleting note:", err);
      const errorMsg = err.response?.data?.message || "Failed to delete document.";
      setError(errorMsg);
      setShowDeleteConfirmModal(false);
      setNoteToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };
  // --- End Delete Handling Functions ---


  const numberOfUploads = userFiles.length;
  const numberOfFilesWithContent = userFiles.filter(file => file.files || file.imageUrl).length;

  return (
    <div className="lg:min-h-screen flex flex-col lg:flex-row">
        {/* <ToastContainer position="top-right" autoClose={3000} /> */}

        {/* --- Profile Info Section (Unchanged) --- */}
        <div className="flex w-full flex-col items-center justify-center bg-white lg:bg-gray-50 p-6 lg:h-screen lg:w-[35%] lg:sticky lg:top-0 border-b lg:border-r border-gray-200">
             <div className="grid h-32 w-32 place-content-center overflow-hidden rounded-full bg-gray-200 mb-4"> <img src={user?.profileImage} alt="User profile" className="h-full w-full object-cover" /> </div> <div className="text-center"> <h2 className="text-xl font-bold text-gray-800"> <span>{user?.firstName}</span> <span>{user?.lastName}</span> </h2> <p className="mt-1 text-sm text-gray-600">@{user?.userName}</p> <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto"> {user?.userBio} </p> </div> <div className="flex items-center justify-center gap-6 mt-6 border-t border-gray-200 pt-6 w-full max-w-xs"> <div className="text-center"> <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Uploads</p> <p className="text-3xl font-bold text-gray-900">{numberOfUploads}</p> </div> <div className="text-center"> <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Files</p> <p className="text-3xl font-bold text-gray-900">{numberOfFilesWithContent}</p> </div> </div>
        </div>

        {/* --- Documents Section --- */}
        <div className="h-auto w-full bg-white p-5 lg:w-[65%]">
            <h1 className="mb-4 text-xl font-bold text-gray-800">My Documents:</h1>
            {error && ( <div className="text-center text-red-600 bg-red-100 border border-red-300 rounded p-3 mb-4"><p>{error}</p></div> )}

            {/* Conditional display based on fetch results */}
            {userFiles.length === 0 && !error && (
                <div className="text-center text-gray-500 py-10">Loading documents or you haven't uploaded any yet.</div>
            )}

            {userFiles.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {userFiles.map((file) => (
                    <div
                        key={file._id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm hover:shadow-md transition-shadow duration-150"
                    >
                        <p className="font-medium text-sm text-gray-700 truncate flex-grow" title={file.fileName}>
                            {file.fileName}
                        </p>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            {/* View File Button */}
                            {(file.imageUrl || file.files) && (
                                <button onClick={() => viewFile(file.imageUrl || file.files)} className="p-1.5 rounded text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1" title="View File">
                                    <FaEye className="w-3.5 h-3.5" />
                                </button>
                            )}
                            {/* Delete Button - Opens Modal */}
                            <button
                                onClick={() => promptDeleteConfirmation(file)} // Use prompt function
                                className={`p-1.5 rounded text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 ${isDeleting && noteToDelete?._id === file._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                // Disable slightly differently - only when this note is targeted by modal
                                disabled={isDeleting && noteToDelete?._id === file._id}
                                title="Delete Note"
                            >
                                {/* Keep icon consistent */}
                                <FaTrashAlt className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
            )}
             {/* --- End Grid --- */}
        </div>

         {/* --- Render Confirmation Modal --- */}
         {showDeleteConfirmModal && (
            <DeleteConfirmModal
                note={noteToDelete}
                onConfirm={confirmDelete} // Passes ID inside
                onCancel={cancelDelete}
                isDeleting={isDeleting} // Controls button state in modal
            />
         )}
         {/* --- End Render Confirmation Modal --- */}

    </div>
  );
};

export default Profile;