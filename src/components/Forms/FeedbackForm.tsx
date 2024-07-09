import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FeedbackFormProps, FeedbackPayload } from '../../types/FeedbackTypes';

interface FormErrors {
  comment: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, orderId, updateData, title }) => {
  const [formData, setFormData] = useState<FeedbackPayload>({
    comment: updateData?.comment || '',
    orderId
  });
  const [errors, setErrors] = useState<FormErrors>({
    comment: ''
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      comment: ''
    };
    let isValid = true;

    if (!formData.comment) {
      newErrors.comment = 'Comment or Review is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    if (validateForm()) {
      const data: FeedbackPayload = {
        ...formData,
        id: updateData?.id || orderId
      };

      if (updateData) {
        const data: any = {
          ...formData,
          id: updateData.id
        };

        if (onSubmit) onSubmit(data);
      }
      if (onSubmit) onSubmit(data);
      if (!updateData) {
        clearForm();
      }
    }
  };

  const clearForm = (): void => {
    setFormData({
      comment: '',
      orderId
    });
    setErrors({
      comment: ''
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form id={`${title?.split(' ').join('')}-form`} onSubmit={handleSubmit} className="w-[542px]" data-testid="form">
      <div className="flex gap-2 flex-col items-start">
        <textarea
          id="review"
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          className={`text-sm outline-none w-full p-2 min-h-20 border ${
            errors.comment ? 'border-red-500' : 'border-gray-300'
          } rounded bg-transparent`}
        />
        <input
          type="text"
          id="different"
          name="different"
          value={orderId}
          hidden
          readOnly={true}
          className={`text-sm outline-none w-full p-2 h-9 border ${
            errors.comment ? 'border-red-500' : 'border-gray-300'
          } rounded bg-transparent`}
        />
        {errors.comment && <span className="text-red-500 text-xs">{errors.comment}</span>}
      </div>
      {title.toLocaleLowerCase().includes('update') && (
        <button
          type="submit"
          className="w-fit  my-2   px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition duration-300"
        >
          Update
        </button>
      )}
    </form>
  );
};

export default FeedbackForm;
