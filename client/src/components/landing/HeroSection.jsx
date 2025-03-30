import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="relative overflow-hidden rounded-lg shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
          {/* Content Area */}
          <div className="absolute inset-0">
            {/* Placeholder for a subtle background image or pattern */}
             <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-yellow-50 opacity-80"></div>
          </div>
          <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:col-span-1 lg:px-16 lg:py-24">
            <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-left lg:text-6xl">
              <span className="block">Organize & Access</span>
              <span className="block text-blue-700">Your Study Notes</span>
            </h1>
            <p className="mt-6 max-w-lg text-center text-xl text-gray-700 lg:text-left">
              Spend less time searching, more time learning. Securely share, find, and collaborate on notes with peers across your college.
            </p>
             {/* Social Proof Placeholder */}
            <p className="mt-4 text-center text-sm font-medium text-gray-600 lg:text-left">
               Trusted by students {/* Add dynamic info later: e.g., at XYZ University */}
            </p>
            {/* Call to Action / Value */}
            <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
               {isAuthenticated ? (
                <div className="rounded-md shadow">
                  <Link
                    to="/search" // Link to search if logged in
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg"
                  >
                    Explore Notes
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
                   <div className="rounded-md shadow">
                    <Link
                        to="/signup"
                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg"
                        >
                        Get Started Free
                    </Link>
                   </div>
                    <div className="rounded-md shadow">
                        <Link
                        to="/login"
                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-blue-700 hover:bg-gray-50 md:py-4 md:px-10 md:text-lg"
                        >
                        Login
                        </Link>
                    </div>
                </div>
              )}
            </div>
          </div>
           {/* Image Area (Placeholder) */}
           <div aria-hidden="true" className="relative hidden h-80 w-full overflow-hidden rounded-lg lg:block lg:h-auto">
              {/* Replace with a high-quality image showing the app or collaboration */}
               <img
                 src="/herousefulIMG.jpeg" // Placeholder
                 alt="the image for the hero section"
                 className="h-full w-full object-cover object-center"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-white opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;