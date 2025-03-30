import React from 'react';

const steps = [
  { id: 1, name: 'Sign Up', description: 'Create your free account in seconds.' },
  { id: 2, name: 'Upload or Find', description: 'Upload your notes or search for materials shared by others.' },
  { id: 3, name: 'Study Smarter', description: 'Access notes anytime, anywhere, and collaborate with peers.' },
];

const HowItWorksSection = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600">How It Works</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Get Started in 3 Easy Steps
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-8">
          {steps.map((step) => (
            <div key={step.id} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                {step.id}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">{step.name}</h3>
              <p className="mt-2 text-base text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;