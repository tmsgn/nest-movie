// app/404.tsx (or pages/404.tsx)
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();

  const goHome = () => {
    router.push('/'); // Redirect to the home page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-6">The page you are looking for might have been moved or doesn't exist.</p>
      <button 
        onClick={goHome} 
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-black">
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
