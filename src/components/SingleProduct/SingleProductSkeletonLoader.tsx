import React from 'react';

function SingleProductSkeletonLoader() {
  return (
    <div className="h-auto w-full p-10 flex items-start justify-center">
      <div className="w-[80vw] flex flex-col items-center justify-start gap-y-4 animate-pulse">
        <div className="w-full h-10 bg-gray-300"></div>

        <div className="w-full flex flex-col sm:flex-row items-start justify-start gap-x-4">
          <div className="w-full flex flex-col-reverse sm:flex-row items-start justify-start gap-x-4">
            <div className="h-[65px] sm:h-[450px] w-[100%] sm:w-[85px] flex flex-row sm:flex-col items-center justify-start gap-x-3 sm:gap-y-3 px-0.5 overflow-x-auto overflow-y-hidden sm:overflow-x-hidden sm:overflow-y-auto mt-4 sm:mt-0 bg-gray-300"></div>
            <div className="h-[450px] w-full sm:w-[375px] bg-gray-300"></div>
          </div>

          <div className="w-full h-[450px] flex flex-col items-start justify-between">
            <div className="w-full flex flex-col items-start justify-start gap-y-2">
              <div className="w-full sm:w-[80%] h-[40px] bg-gray-300"></div>
              <div className="w-full sm:w-[80%] h-[40px] bg-gray-300"></div>
              <div className="w-full sm:w-[80%] h-[40px] bg-gray-300 mt-8"></div>
            </div>

            <div className="w-full flex flex-col items-start justify-start gap-y-2">
              <div className="w-[20%] h-[20px] bg-gray-300"></div>
              <div className="w-[30%] h-[40px] bg-gray-300"></div>
              <div className="w-[40%] h-[40px] bg-gray-300"></div>
              <div className="w-[30%] h-[20px] bg-gray-300"></div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-y-2 mt-10">
          <div className="w-[80%] h-10 bg-gray-300"></div>
        </div>

        <div className="w-full flex flex-col items-start justify-start gap-y-2 mt-2">
          <div className="w-[80%] h-[200px] bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}

export default SingleProductSkeletonLoader;
