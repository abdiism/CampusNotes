import React from 'react';
// Replace with relevant icons
import { FaUniversity, FaClock, FaLightbulb, FaShareAlt } from 'react-icons/fa';

const benefits = [
    { name: "Centralized Access", description: "All your course notes, accessible from any device.", icon: FaUniversity },
    { name: "Save Time", description: "Stop hunting for notes. Find what you need instantly.", icon: FaClock },
    { name: "Discover Insights", description: "Access notes from seniors and peers for better understanding.", icon: FaLightbulb },
    { name: "Easy Collaboration", description: "Share your knowledge and help fellow students.", icon: FaShareAlt },
];

const BenefitsSection = () => {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Students Choose CampusNotes?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Unlock a more organized and collaborative way to study.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
           {benefits.map((benefit) => (
             <div key={benefit.name} className="flex flex-col items-center text-center">
                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 mb-4">
                     <benefit.icon className="h-6 w-6" />
                 </div>
                 <h3 className="text-lg font-semibold text-gray-900">{benefit.name}</h3>
                 <p className="mt-2 text-base text-gray-600">{benefit.description}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;