import React from 'react';

function CartSkeletonLoader() {
  return (
    <div className="h-auto w-full p-10 flex items-start justify-center">
      <div className="w-[80vw] flex flex-col items-center justify-start gap-y-2 animate-pulse">
        <div className="w-full items-center justify-start">
          <div className="w-full sm:w-[30%] h-8 bg-gray-300"></div>
        </div>
        <div className="w-full h-8 bg-gray-300 mt-4"></div>
        <div className="w-full h-1 bg-gray-300"></div>

        <div className="w-full h-[100px] bg-gray-300 mt-2"></div>
        <div className="w-full h-[100px] bg-gray-300 mt-2"></div>

        <div className="w-full items-center justify-start mt-4">
          <div className="w-full sm:w-[30%] h-8 bg-gray-300"></div>
        </div>
        <div className="w-full items-center justify-start mt-4">
          <div className="w-full sm:w-[50%] h-10 bg-gray-300"></div>
        </div>

        <div className="w-full items-center justify-start mt-4">
          <div className="w-full sm:w-[30%] h-8 bg-gray-300"></div>
        </div>

        <div className="w-full items-center justify-start mt-4">
          <div className="w-full sm:w-[50%] h-10 bg-gray-300"></div>
        </div>

        <div className="w-full items-center justify-start">
          <div className="w-full sm:w-[50%] h-10 bg-gray-300"></div>
        </div>

        <div className="w-full items-center justify-start">
          <div className="w-full sm:w-[50%] h-10 bg-gray-300"></div>
        </div>

        <div className="w-full items-center justify-start mt-4">
          <div className="w-full sm:w-[50%] h-10 bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}

export default CartSkeletonLoader;
