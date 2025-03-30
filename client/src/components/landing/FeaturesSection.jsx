import React from 'react';
// Example icons (replace with actual icons later)
import { FaFileUpload, FaSearch, FaUsers, FaEdit } from 'react-icons/fa';

const features = [
  {
    name: 'Easy Uploads',
    description: 'Quickly upload your notes in PDF, text, or image format. Keep everything organized in one place.',
    icon: FaFileUpload,
  },
  {
    name: 'Powerful Search',
    description: 'Find exactly what you need with smart search across titles, descriptions, tags, and even text content (future feature).',
    icon: FaSearch,
  },
  {
    name: 'Community Sharing',
    description: 'Access notes shared by peers from your college community. Discover different perspectives and resources.',
    icon: FaUsers,
  },
  {
    name: 'Text & Image Notes',
    description: 'Go beyond PDFs. Create notes directly with text and images, perfect for quick summaries or visual guides.',
    icon: FaEdit,
  },
];

const FeaturesSection = () => {
  return (
    <div id="features" className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need to Succeed
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            FindMyNotes provides the tools to manage your study materials effectively.
          </p>
        </div>

        <div className="mt-16">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;