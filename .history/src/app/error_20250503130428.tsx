"use client";
import React from "react";
import { useRouter } from "next/navigation";

const ErrorPage = ({ error }: { error: Error }) => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
      <p className="text-xl mb-6">
        We are unable to process your request at this moment.
      </p>
      <p className="text-md mb-6">Error: {error.message}</p>
      <button
        onClick={goBack}
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-black"
      >
        Go Back
      </button>
    </div>
  );
};

export default ErrorPage;
