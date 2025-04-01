import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // For modal close button
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
    }
};

// --- Note Detail Modal Component (Style block removed) ---
const NoteModal = ({ note, onClose }) => {
  if (!note) return null;
  // viewFile helper defined inside modal scope
  const viewFile = (fileIdentifier) => {
      if (fileIdentifier && (fileIdentifier.startsWith('http://') || fileIdentifier.startsWith('https://'))) {
          window.open(fileIdentifier, "_blank", "noreferrer");
      } else if (fileIdentifier) {
          window.open(`http://localhost:6969/files/${fileIdentifier}`, "_blank", "noreferrer");
      }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300">
        {/* Removed animation class trigger for simplicity */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 relative transform transition-all duration-300 scale-100 opacity-100">
        <button onClick={onClose} className="absolute top-3 right-4 text-blue-400 hover:text-blue-600 text-3xl font-light leading-none" aria-label="Close modal"><IoClose /></button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3 pr-8">{note.fileName}</h2>
        {note.fileDescription && (<p className="text-sm text-gray-700 mb-4">{note.fileDescription}</p>)}
        {note.noteContent && (<p className="text-base text-gray-800 whitespace-pre-wrap mb-4">{note.noteContent}</p>)}
        {note.tags && note.tags.length > 0 && ( <div className="flex flex-wrap gap-2 pt-4 border-t border-blue-100"> {note.tags.map((tag, index) => (<span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>))} </div> )}
        {(note.imageUrl || note.files) && ( <div className={`pt-4 ${note.tags && note.tags.length > 0 ? 'mt-4 border-t border-blue-100' : ''}`}> <button onClick={() => viewFile(note.imageUrl || note.files)} className="inline-flex items-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1">View Attached File</button> </div> )}
      </div>
      {/* Removed <style jsx global> block */}
    </div>
  );
};
// --- End Note Detail Modal ---

// --- Delete Confirmation Modal Component (Keep from previous code) ---
const DeleteConfirmModal = ({ note, onConfirm, onCancel, isDeleting }) => {
    if (!note) return null;
    // ... (DeleteConfirmModal JSX remains the same) ...
     return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"> <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300 scale-95 opacity-0 animate-modal-scale-in"> <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Deletion</h3> <p className="text-sm text-gray-600 mb-6"> Are you sure you want to delete the note titled: <br /> <strong className="font-medium text-gray-900">"{note.fileName}"</strong>? <br /> This action cannot be undone. </p> <div className="flex justify-end space-x-3"> <button onClick={onCancel} disabled={isDeleting} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50">Cancel</button> <button onClick={() => onConfirm(note._id)} disabled={isDeleting} className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 ${isDeleting ? 'cursor-not-allowed' : ''}`}> {isDeleting ? "Deleting..." : "Delete"} </button> </div> </div> <style jsx global>{` @keyframes modal-scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-modal-scale-in { animation: modal-scale-in 0.2s ease-out forwards; } `}</style> </div> );
};
// --- End Delete Confirmation Modal ---


const Profile = () => {
  // ... (state variables remain the same: userFiles, error, showModal, selectedNoteForModal, showDeleteConfirmModal, noteToDelete, isDeleting) ...
  const user = useSelector((state) => state.user.userData); const [userFiles, setUserFiles] = useState([]); const [error, setError] = useState(''); const [showModal, setShowModal] = useState(false); const [selectedNoteForModal, setSelectedNoteForModal] = useState(null); const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); const [noteToDelete, setNoteToDelete] = useState(null); const [isDeleting, setIsDeleting] = useState(false);
  const userId = user?._id;

  useEffect(() => {
    // ... (useEffect logic remains the same) ...
    const getUserFiles = async () => { if (!userId) return; setError(''); setUserFiles([]); try { const result = await axios.get(`http://localhost:6969/notes/getFiles/${userId}`); if (result.data?.data && Array.isArray(result.data.data)) { setUserFiles(result.data.data); } else { setUserFiles([]); } } catch (err) { console.error("Error fetching user files:", err); setError(err.response?.data?.message || "Failed to load documents."); setUserFiles([]); } }; getUserFiles();
  }, [userId]);

  // --- Modal Handlers (remain the same) ---
  const handleOpenNote = (note) => { setSelectedNoteForModal(note); setShowModal(true); /* Optional view count trigger */ };
  const handleCloseModal = () => { setShowModal(false); setSelectedNoteForModal(null); };
  const promptDeleteConfirmation = (note) => { setNoteToDelete(note); setShowDeleteConfirmModal(true); };
  const cancelDelete = () => { setShowDeleteConfirmModal(false); setNoteToDelete(null); };
  const confirmDelete = async (noteIdToDelete) => { setIsDeleting(true); setError(''); try { const response = await axios.delete(`http://localhost:6969/notes/${noteIdToDelete}`); console.log(response.data.message); setUserFiles(prevFiles => prevFiles.filter(file => file._id !== noteIdToDelete)); setShowDeleteConfirmModal(false); setNoteToDelete(null); } catch (err) { console.error("Error deleting note:", err); setError(err.response?.data?.message || "Failed to delete document."); setShowDeleteConfirmModal(false); setNoteToDelete(null); } finally { setIsDeleting(false); } };
  // --- End Modal Handlers ---

  const numberOfUploads = userFiles.length;
  const numberOfFilesWithContent = userFiles.filter(file => file.files || file.imageUrl).length;

  return (
    <div className="lg:min-h-screen flex flex-col lg:flex-row">
        {/* Profile Info Section */}
        {/* ... (remains the same) ... */}
        <div className="flex w-full flex-col items-center justify-center bg-white lg:bg-gray-50 p-6 lg:h-screen lg:w-[35%] lg:sticky lg:top-0 border-b lg:border-r border-gray-200"> <div className="grid h-32 w-32 place-content-center overflow-hidden rounded-full bg-gray-200 mb-4"> <img src={user?.profileImage} alt="User profile" className="h-full w-full object-cover" /> </div> <div className="text-center"> <h2 className="text-xl font-bold text-gray-800"> <span>{user?.firstName}</span> <span>{user?.lastName}</span> </h2> <p className="mt-1 text-sm text-gray-600">@{user?.userName}</p> <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto"> {user?.userBio} </p> </div> <div className="flex items-center justify-center gap-6 mt-6 border-t border-gray-200 pt-6 w-full max-w-xs"> <div className="text-center"> <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Uploads</p> <p className="text-3xl font-bold text-gray-900">{numberOfUploads}</p> </div> <div className="text-center"> <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Files</p> <p className="text-3xl font-bold text-gray-900">{numberOfFilesWithContent}</p> </div> </div> </div>

        {/* Documents Section */}
        <div className="h-auto w-full bg-white p-5 lg:w-[65%]">
            <h1 className="mb-4 text-xl font-bold text-gray-800">My Documents:</h1>
            {error && ( <div className="text-center text-red-600 bg-red-100 border border-red-300 rounded p-3 mb-4"><p>{error}</p></div> )}
            {userFiles.length === 0 && !error && ( <div className="text-center text-gray-500 py-10">You haven't uploaded any documents yet.</div> )}
            {userFiles.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {userFiles.map((file) => (
                    <div key={file._id} className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm hover:shadow-md transition-shadow duration-150">
                        <p className="font-medium text-sm text-gray-700 truncate flex-grow" title={file.fileName}>{file.fileName}</p>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            {/* Open Note Button */}
                            <button onClick={() => handleOpenNote(file)} className="p-1.5 rounded text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1" title="Open Note Details"> <FaEye className="w-3.5 h-3.5" /> </button>
                            {/* Delete Button */}
                            <button onClick={() => promptDeleteConfirmation(file)} className={`p-1.5 rounded text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 ${isDeleting && noteToDelete?._id === file._id ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isDeleting && noteToDelete?._id === file._id} title="Delete Note"> {isDeleting && noteToDelete?._id === file._id ? ( <span className="text-xs">...</span> ) : ( <FaTrashAlt className="w-3.5 h-3.5" /> )} </button>
                        </div>
                    </div>
                    ))}
                </div>
             )}
        </div>

         {/* Render Modals */}
         {showModal && <NoteModal note={selectedNoteForModal} onClose={handleCloseModal} />}
         {showDeleteConfirmModal && ( <DeleteConfirmModal note={noteToDelete} onConfirm={confirmDelete} onCancel={cancelDelete} isDeleting={isDeleting}/> )}

    </div>
  );
};

export default Profile;