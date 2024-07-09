import React, { useState } from 'react';
import { Feedback } from '../../types/FeedbackTypes';

interface ConfirmDeletePopupProps {
  feedback: Feedback;
  onDelete: (feedbackId: string) => void;
}

const ConfirmDeletePopup: React.FC<ConfirmDeletePopupProps> = ({ feedback, onDelete }) => {
  const [isVisible, setIsVisible] = useState(false);

  const openFormPopup = () => {
    setIsVisible(true);
  };

  const closeFormPopup = () => {
    setIsVisible(false);
  };

  const handleConfirmDelete = () => {
    onDelete(feedback.id);
    closeFormPopup();
  };

  return (
    <div className="relative text-black">
      <span onClick={openFormPopup} className="cursor-pointer text-red-500 hover:underline">
        Delete
      </span>

      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this feedback?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeFormPopup}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-200 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmDeletePopup;
