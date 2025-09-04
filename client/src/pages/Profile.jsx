// client/src/pages/Profile.jsx
import React, { useEffect, useState } from "react"; // <<<  useState is imported
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify'; // Assuming you'll use toast
import 'react-toastify/dist/ReactToastify.css';

// --- viewFile Helper Function ---
const viewFile = (fileIdentifier) => {
    if (fileIdentifier && (fileIdentifier.startsWith('http://') || fileIdentifier.startsWith('https://'))) {
        window.open(fileIdentifier, "_blank", "noreferrer");
    } else if (fileIdentifier) {
        // This path is for locally served files from your backend
        window.open(`http://localhost:6969/files/${fileIdentifier}`, "_blank", "noreferrer");
    } else {
        console.warn("viewFile called with invalid identifier:", fileIdentifier);
        // toast.error("Cannot open file: Invalid file identifier."); // Optional toast
    }
};

// --- Note Detail Modal Component ---
const NoteModal = ({ note, onClose }) => {
  if (!note) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-blue-400 hover:text-blue-600 text-3xl" aria-label="Close modal"><IoClose /></button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3 pr-8">{note.fileName}</h2>
        {note.fileDescription && (<p className="text-sm text-gray-700 mb-4">{note.fileDescription}</p>)}
        {note.noteContent && (<p className="text-base text-gray-800 whitespace-pre-wrap mb-4">{note.noteContent}</p>)}
        {note.tags && note.tags.length > 0 && ( <div className="flex flex-wrap gap-2 pt-4 border-t border-blue-100"> {note.tags.map((tag, index) => (<span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>))} </div> )}
        {(note.files) && ( <div className={`pt-4 ${note.tags && note.tags.length > 0 ? 'mt-4 border-t border-blue-100' : ''}`}> <button onClick={() => viewFile(note.files)} className="inline-flex items-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1">View Attached File</button> </div> )}
      </div>
    </div>
  );
};

// --- Delete Confirmation Modal Component ---
const DeleteConfirmModal = ({ note, onConfirm, onCancel, isDeleting }) => {
    if (!note) return null;
     return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Deletion</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete the note titled: <br />
                    <strong className="font-medium text-gray-900">"{note.fileName}"</strong>? <br />
                    This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onCancel} disabled={isDeleting} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none disabled:opacity-50">Cancel</button>
                    <button onClick={() => onConfirm(note._id)} disabled={isDeleting} className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50 ${isDeleting ? 'cursor-not-allowed' : ''}`}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};


const Profile = () => {
  const user = useSelector((state) => state.user.userData); // User from Redux
  const [userFiles, setUserFiles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Start loading true
  const [showModal, setShowModal] = useState(false);
  const [selectedNoteForModal, setSelectedNoteForModal] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUserNotes = async () => {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Not authenticated. Please log in.");
        toast.error("Not authenticated. Please log in.");
        setIsLoading(false);
        return;
      }

      // Although user is from Redux, the token dictates whose notes are fetched by the backend endpoint
      // The user object from Redux is mainly for displaying profile info.
      // The API call will use the token to identify the user on the backend.

      try {
        // API call to the endpoint that gets notes for the AUTHENTICATED user (via token)
        const response = await axios.get(
          "http://localhost:6969/notes/getFilesByUserId", // This endpoint should use req.user.id from token
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setUserFiles(response.data.data);
        } else {
          setUserFiles([]);
        }
      } catch (err) {
        console.error("Error fetching user files for profile:", err);
        const errorMessage = err.response?.data?.message || "Failed to load your documents.";
        setError(errorMessage);
        if(err.response?.status !== 404) { // Don't toast for 404 if route isn't found yet, but do for other errors
            toast.error(errorMessage);
        }
        setUserFiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch notes if a token exists (implies user is logged in or was logged in)
    // The Redux 'user' object is mainly for displaying info on this page.
    // The actual fetching is determined by the presence of a token.
    if (localStorage.getItem('authToken')) {
        fetchUserNotes();
    } else if (!user) { // If no token AND no user in Redux, show login message
        setError("Please log in to view your profile and documents.");
        setIsLoading(false); // Stop loading if no attempt to fetch can be made
    }

    // Dependency: If user object in Redux changes, you might want to re-evaluate,
    // but primarily, this should fetch once on mount if a token is present.
    // Using an empty dependency array [] ensures it runs once on mount.
    // If you want it to re-run if the Redux `user` object itself changes (e.g., after an update profile action)
    // you could add `user` to the dependency array, but be mindful of infinite loops if `user` object reference changes often.
    // For fetching notes based on logged-in status, empty array is fine if login sets token and navigates here.
  }, []); // Fetch on component mount


  const handleOpenNote = (note) => { setSelectedNoteForModal(note); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setSelectedNoteForModal(null); };
  const promptDeleteConfirmation = (note) => { setNoteToDelete(note); setShowDeleteConfirmModal(true); };
  const cancelDelete = () => { setShowDeleteConfirmModal(false); setNoteToDelete(null); };

  const confirmDelete = async (noteIdToDelete) => {
    setIsDeleting(true);
    setError('');
    const token = localStorage.getItem('authToken');
    if (!token) {
        toast.error("Authentication required to delete.");
        setIsDeleting(false);
        setShowDeleteConfirmModal(false);
        setNoteToDelete(null);
        return;
    }
    try {
        const response = await axios.delete(
            `http://localhost:6969/notes/${noteIdToDelete}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        toast.success(response.data.message || "Note deleted successfully.");
        setUserFiles(prevFiles => prevFiles.filter(file => file._id !== noteIdToDelete));
    } catch (err) {
        console.error("Error deleting note:", err);
        const deleteErrorMessage = err.response?.data?.message || "Failed to delete document.";
        setError(deleteErrorMessage);
        toast.error(deleteErrorMessage);
    } finally {
        setIsDeleting(false);
        setShowDeleteConfirmModal(false);
        setNoteToDelete(null);
    }
  };

  const numberOfUploads = userFiles.length;
  const numberOfFilesAttached = userFiles.filter(file => file.files).length;

  if (!user && !localStorage.getItem('authToken')) { // If no user in Redux and no token, means not logged in
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
            <ToastContainer />
            <p className="text-gray-700">{error || "Please log in to view your profile."}</p>
        </div>
    );
  }
  if (!user && localStorage.getItem('authToken') && isLoading) { // Token exists, user data might be loading via another mechanism or profile just mounted
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
            <ToastContainer />
            <p className="text-gray-700">Loading profile information...</p>
        </div>
      )
  }


  return (
    <div className="lg:min-h-screen flex flex-col lg:flex-row">
        <ToastContainer position="top-right" autoClose={3000} />
        {/* Profile Info Section */}
        <div className="flex w-full flex-col items-center justify-center bg-white lg:bg-gray-50 p-6 lg:h-screen lg:w-[35%] lg:sticky lg:top-0 border-b lg:border-r border-gray-200">
            <div className="grid h-32 w-32 place-content-center overflow-hidden rounded-full bg-gray-200 mb-4">
                <img src={user?.profileImage || '/default-profile.png'} alt={`${user?.firstName} ${user?.lastName}`} className="h-full w-full object-cover" />
            </div>
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">
                    <span>{user?.firstName || 'User'}</span> <span>{user?.lastName || 'Name'}</span>
                </h2>
                <p className="mt-1 text-sm text-gray-600">@{user?.userName || 'username'}</p>
                <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
                    {user?.userBio || "No bio available."}
                </p>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 border-t border-gray-200 pt-6 w-full max-w-xs">
                <div className="text-center">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</p>
                    <p className="text-3xl font-bold text-gray-900">{numberOfUploads}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Attachments</p>
                    <p className="text-3xl font-bold text-gray-900">{numberOfFilesAttached}</p>
                </div>
            </div>
        </div>

        {/* Documents Section */}
        <div className="h-auto w-full bg-white p-5 lg:w-[65%]">
            <h1 className="mb-4 text-xl font-bold text-gray-800">My Documents:</h1>
            {isLoading && <div className="text-center text-gray-500 py-10">Loading your documents...</div>}
            {error && !isLoading && ( <div className="text-center text-red-600 bg-red-100 border border-red-300 rounded p-3 mb-4"><p>{error}</p></div> )}
            {!isLoading && userFiles.length === 0 && !error && ( <div className="text-center text-gray-500 py-10">You haven't uploaded any documents yet.</div> )}
            {!isLoading && userFiles.length > 0 && !error && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {userFiles.map((file) => (
                    <div key={file._id} className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm hover:shadow-md transition-shadow duration-150">
                        <p className="font-medium text-sm text-gray-700 truncate flex-grow" title={file.fileName}>{file.fileName}</p>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            <button onClick={() => handleOpenNote(file)} className="p-1.5 rounded text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1" title="Open Note Details"> <FaEye className="w-3.5 h-3.5" /> </button>
                            <button onClick={() => promptDeleteConfirmation(file)} className={`p-1.5 rounded text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 ${isDeleting && noteToDelete?._id === file._id ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isDeleting && noteToDelete?._id === file._id} title="Delete Note"> {isDeleting && noteToDelete?._id === file._id ? ( <span className="text-xs">...</span> ) : ( <FaTrashAlt className="w-3.5 h-3.5" /> )} </button>
                        </div>
                    </div>
                    ))}
                </div>
             )}
        </div>

         {showModal && <NoteModal note={selectedNoteForModal} onClose={handleCloseModal} />}
         {showDeleteConfirmModal && ( <DeleteConfirmModal note={noteToDelete} onConfirm={confirmDelete} onCancel={cancelDelete} isDeleting={isDeleting}/> )}
    </div>
  );
};

export default Profile;