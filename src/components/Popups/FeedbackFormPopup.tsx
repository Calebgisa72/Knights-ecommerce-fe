import React, { useState } from 'react';
import { FeedbackPayload, FeedbackFormPopupProps } from '../../types/FeedbackTypes';

const FeedbackFormPopup: React.FC<FeedbackFormPopupProps> = ({
  trigger,
  title,
  body,
  onSubmit,
  onClose,
  submitText,
  closeText
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const openFormPopup = () => {
    setIsVisible(true);
  };

  const closeFormPopup = () => {
    setIsVisible(false);
    if (onClose) onClose(); // Call onClose to handle any cleanup or state changes outside the component
  };

  const submitHandler = (data: FeedbackPayload) => {
    if (onSubmit) onSubmit(data);
    closeFormPopup();
  };
  return (
    <div className="relative text-black">
      {/* Trigger element to open the popup */}
      <span onClick={openFormPopup}>{trigger}</span>

      {/* Popup content */}
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          // Close the popup when clicking outside
          if (!isVisible) return; // Prevent unnecessary state updates
          closeFormPopup();
        }}
        data-testid="dialog"
      >
        <div
          className={`bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out ${
            isVisible ? 'scale-100' : 'scale-0'
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the FormPopup
        >
          <h2 className="text-2xl mb-4 text-start">{title}</h2>
          <div className="mb-4">{React.cloneElement(body as React.ReactElement<any>, { onSubmit: submitHandler })}</div>
          <div className="flex justify-between space-x-4 gap-3">
            {/* Close button */}
            <button
              onClick={closeFormPopup}
              className="w-1/2 px-4 py-2 border border-primary text-primary rounded hover:bg-opacity-40 transition duration-300"
            >
              {closeText}
            </button>
            {/* Submit button */}
            <button
              onClick={() => {
                const form = document.querySelector(`#${title.split(' ').join('')}-form`); // Assuming each form has a unique ID based on the title
                if (form) {
                  form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
              }}
              className="w-1/2 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition duration-300"
            >
              {submitText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackFormPopup;
