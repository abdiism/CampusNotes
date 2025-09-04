import React from "react";
import { Link } from "react-router-dom";
// Consider adding social icons
// import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get current year dynamically

  return (
    <footer className="bg-zinc-700 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* About Section */}
          <div className="space-y-4 xl:col-span-1">
            <img className="h-10" src="/logo.png" alt="CampusNotes Logo - Footer" /> {/* Adjust path/style */}
            <p className="text-sm text-gray-400">
              Making study materials accessible and organized for college students everywhere.
            </p>
            {/* Social Media Links Placeholder */}
            
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Navigation</h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li><Link to="/about" className="text-base text-gray-300 hover:text-white">About</Link></li>
                  <li><Link to="/faq" className="text-base text-gray-300 hover:text-white">FAQ</Link></li>
                   {/* Add other relevant links */}
                   <li><Link to="/#features" className="text-base text-gray-300 hover:text-white">Features</Link></li>
                </ul>
              </div>
              {/* Legal Links */}
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Legal</h3>
                <ul role="list" className="mt-4 space-y-2">
                
                </ul>
              </div>
            </div>
             {/* Contact Info */}
            <div className="md:grid md:grid-cols-1 md:gap-8"> {/* Adjusted for single column */}
                 <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Contact</h3>
                     <ul role="list" className="mt-4 space-y-2">
                        {/* using mailto link for email */}
                        <li><a href="mailto:CampusNotes1230@gmail.com" className="text-base text-gray-300 hover:text-white">CampusNotes1230@gmail.com</a></li>
                        
                       
                        
                      
                    </ul>
                 </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {currentYear} CampusNotes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;