import React, { useState } from "react"; // Import useState
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
// Import icons for hamburger and close
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5"; // Close icon
import { useDispatch, useSelector } from "react-redux";
import { removeUserData } from "../Redux/slices/user-slice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- State for Mobile Menu ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // --- End State ---

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleLogout = () => {
    dispatch(removeUserData());
    setIsMobileMenuOpen(false); // Close menu on logout
    navigate("/");
  };

  // --- Toggle Function ---
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  // --- End Toggle Function ---

  // Function to close menu when a link is clicked
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    // Added relative positioning for potential absolute positioning of mobile menu
    <header className="sticky top-0 z-50 flex h-20 items-center justify-center bg-white shadow-md">
      <div className="mx-5 flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex h-12 w-auto items-center justify-center overflow-hidden">
          <Link to="/" onClick={handleMobileLinkClick}> {/* Close menu on logo click */}
            <img src="/logo.png" alt="CampusNotes Logo" className="h-10 md:h-12" />
          </Link>
        </div>

        {/* Hamburger Menu Icon / Close Icon (Mobile) */}
        <div className="md:hidden">
          {/* --- Added onClick and conditional icon --- */}
          <button
            type="button"
            onClick={toggleMobileMenu} // Attach toggle function
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <IoClose className="block h-6 w-6" aria-hidden="true" /> // Show Close icon when open
            ) : (
              <GiHamburgerMenu className="block h-6 w-6" aria-hidden="true" /> // Show Hamburger icon when closed
            )}
          </button>
          {/* --- End Added onClick --- */}
        </div>


        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex md:items-center md:gap-6 lg:gap-8">
          {/* ... (Desktop links remain the same as your provided code) ... */}
           <Link to="/" className="text-base font-medium text-gray-600 hover:text-blue-700">Home</Link>
           <Link to="/about" className="text-base font-medium text-gray-600 hover:text-blue-700">About</Link>
           <Link to="/faq" className="text-base font-medium text-gray-600 hover:text-blue-700">FAQ</Link>
           {isAuthenticated ? (
             <div className="flex items-center gap-4">
               <Link to="/search" title="Search Notes" className="text-gray-500 hover:text-blue-700"><FaSearch className="h-5 w-5" /></Link>
               <Link to="/upload" title="Upload Note" className="text-gray-500 hover:text-blue-700"><MdOutlineFileUpload className="h-6 w-6" /></Link>
               <Link to="/profile"><button className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700">Profile</button></Link>
               <button onClick={handleLogout} className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50">Logout</button>
             </div>
           ) : (
             <div className="flex items-center gap-4">
               <Link to="/login"><button className="whitespace-nowrap text-base font-medium text-gray-600 hover:text-blue-700">Login</button></Link>
               <Link to="/signup"><button className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700">Sign Up</button></Link>
             </div>
           )}
        </nav>
      </div>

      {/* --- Mobile Menu --- */}
      {/* Conditionally render based on state */}
      {isMobileMenuOpen && (
        // Added md:hidden so it only shows on mobile
        // Position absolute to overlay content, or adjust layout as needed
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200" id="mobile-menu">
           {/* Added padding */}
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Add mobile links here, closing menu onClick */}
            <Link to="/" onClick={handleMobileLinkClick} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">Home</Link>
            <Link to="/about" onClick={handleMobileLinkClick} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">About</Link>
            <Link to="/faq" onClick={handleMobileLinkClick} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">FAQ</Link>

            {/* Divider */}
             <hr className="my-2 border-gray-200"/>

            {isAuthenticated ? (
              <>
                <Link to="/search" onClick={handleMobileLinkClick} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">Search Notes</Link>
                <Link to="/upload" onClick={handleMobileLinkClick} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">Upload Note</Link>
                <Link to="/profile" onClick={handleMobileLinkClick} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={handleMobileLinkClick} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">Login</Link>
                <Link to="/signup" onClick={handleMobileLinkClick} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
      {/* --- End Mobile Menu --- */}
    </header>
  );
};

export default Header;