import React, { useState } from 'react';
import { FormPopupProps } from '../../types/CouponTypes';

const ConfirmDeletePopup: React.FC<FormPopupProps> = ({
  trigger,
  title,
  body,
  onSubmit,
  submitText = 'Yes',
  closeText = 'No'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const openFormPopup = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsVisible(true);
  };

  const closeFormPopup = (event?: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
    setIsVisible(false);
  };

  const handleConfirm = (e: any) => {
    e.stopPropagation();
    if (onSubmit) onSubmit(e);
    closeFormPopup();
  };

  return (
    <div className="relative text-black">
      <span onClick={openFormPopup}>{trigger}</span>

      {isVisible && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out">
            <h2 className="text-2xl mb-4 text-start">{title}</h2>
            <div className="mb-4">{body}</div>
            <div className="flex justify-end space-x-4">
              <button
                data-testid="deny"
                onClick={closeFormPopup}
                className="px-4 py-2 border border-primary text-primary rounded hover:bg-opacity-40 transition duration-300"
              >
                {closeText}
              </button>
              <button
                data-testid="accept"
                onClick={handleConfirm}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition duration-300"
              >
                {submitText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmDeletePopup;
