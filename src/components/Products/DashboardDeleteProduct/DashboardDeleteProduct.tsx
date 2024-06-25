import React from 'react';

const DeleteCouponModal: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-red-500 font-bold">Delete coupon FLAT10!</h1>
      <p>Are you sure you want to accept this?</p>
      <div className="flex justify-between mt-4">
        <button className="bg-white border border-gray-300 text-black py-2 px-4 rounded hover:bg-gray-100">
          No, Cancel
        </button>
        <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Yes, Deactivate</button>
      </div>
    </div>
  );
};

export default DeleteCouponModal;
