import React from 'react';

// IMPORTANT: Replace with REAL testimonials later
const testimonials = [
  {
    id: 1,
    name: 'Zack',
    role: 'Engineering Student',
    // Use real image paths later
    imageUrl: '/images/testimonials/t2.jpg',
    quote: "CampusNotes saved me hours during exam prep! Finding notes from previous batches was a game-changer.",
  },
   {
    id: 2,
    name: 'Hamzaa',
    role: 'Commerce Student',
    imageUrl: '/images/testimonials/t1.png',
    quote: "Sharing my notes helped me solidify concepts, and accessing other's notes gave me new perspectives.",
  },
  {
    id: 3,
    name: 'Abdi',
    role: 'Engineering Student',
    imageUrl: '/images/testimonials/t3.png',
    quote: "The search feature is so intuitive! I can find exactly what I need in seconds.",
  }
  // Add more testimonials
];

const TestimonialsSection = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What Our Users Say
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg shadow-sm">
              <img className="h-16 w-16 rounded-full mb-4" src={testimonial.imageUrl} alt={testimonial.name} />
              <blockquote className="text-gray-700 italic">
                <p>"{testimonial.quote}"</p>
              </blockquote>
              <footer className="mt-4">
                <p className="text-base font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;