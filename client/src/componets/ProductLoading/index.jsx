import React from 'react';

const placeholders = Array.from({ length: 6 });

const ProductLoading = () => {
  return (
    <div className="grid w-full grid-cols-2 gap-4 py-5 md:grid-cols-3 xl:grid-cols-6">
      {placeholders.map((_, index) => (
        <div key={index} className="col h-[250px] min-w-0 animate-pulse">
          <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-gray-300">
            <svg
              className="h-11 w-11 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-2.5 w-full rounded-full bg-gray-300"></div>
            <div className="h-2 w-full rounded-full bg-gray-300"></div>
            <div className="h-2 w-4/5 rounded-full bg-gray-300"></div>
            <div className="h-2 w-3/5 rounded-full bg-gray-300"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductLoading;
