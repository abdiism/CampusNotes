import React, { useState } from 'react';

// Use questions from your original Faq.jsx or add new ones
const faqsData = [
    {
      question: "What is CampusNotes?",
      answer:
        "CampusNotes is an online platform designed to facilitate the sharing and access of educational resources among college students. It allows users to upload and download study materials such as notes, presentations, and study guides.",
    },
    {
      question: "Is CampusNotes free to use?",
      answer:
        "Yes, CampusNotes is currently free to use. We believe in making education accessible to everyone.",
    },
     {
      question: "What types of files can I upload?",
      answer:
        "You can upload PDFs, text content, and images (like PNG, JPG).",
    },
    {
      question: "How do I search for notes?",
      answer:
        "Use the search bar after logging in. You can search by title, description, or tags.",
    },
  // Add more relevant FAQs
];

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 py-6">
        <dt>
            <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-start justify-between text-left text-gray-900"
            >
            <span className="text-base font-medium">{question}</span>
            <span className="ml-6 flex h-7 items-center">
                {/* Heroicon name: outline/chevron-down or chevron-up */}
                <svg
                className={`h-6 w-6 transform ${isOpen ? '-rotate-180' : 'rotate-0'}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </span>
            </button>
        </dt>
        {isOpen && (
            <dd className="mt-2 pr-12">
            <p className="text-base text-gray-600">{answer}</p>
            </dd>
        )}
        </div>
    );
}


const FAQSection = () => {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="mt-12">
          <dl className="space-y-6 divide-y divide-gray-200">
            {faqsData.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;