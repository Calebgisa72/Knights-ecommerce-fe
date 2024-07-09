import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FeedbackForm from '../../../components/Forms/FeedbackForm';
import { FeedbackFormProps } from '../../../types/FeedbackTypes';

const setup = (props: FeedbackFormProps) => {
  return render(<FeedbackForm {...props} />);
};

describe('FeedbackForm', () => {
  const defaultProps: FeedbackFormProps = {
    onSubmit: vi.fn(),
    orderId: '12345',
    updateData: undefined,
    title: 'Share with us your review'
  };

  it('renders the form correctly', () => {
    setup(defaultProps);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays validation error when trying to submit an empty form', () => {
    setup(defaultProps);

    fireEvent.submit(screen.getByTestId('form'));

    expect(screen.getByText('Comment or Review is required')).toBeInTheDocument();
  });

  it('calls onSubmit with the correct data when form is submitted', () => {
    const onSubmitMock = vi.fn();
    const updatedProps: FeedbackFormProps = {
      ...defaultProps,
      onSubmit: onSubmitMock
    };

    setup(updatedProps);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Great product!' } });
    fireEvent.submit(screen.getByTestId('form'));

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    expect(onSubmitMock).toHaveBeenCalledWith({
      comment: 'Great product!',
      orderId: '12345',
      id: '12345'
    });
  });

  it('populates the form with updateData if it exists', () => {
    const updatedProps: FeedbackFormProps = {
      ...defaultProps,
      updateData: { id: '67890', comment: 'Updated comment' }
    };

    setup(updatedProps);

    expect(screen.getByRole('textbox')).toHaveValue('Updated comment');
  });

  it('resets the form after submission if not updating', () => {
    const onSubmitMock = vi.fn();
    const updatedProps: FeedbackFormProps = {
      ...defaultProps,
      onSubmit: onSubmitMock
    };

    setup(updatedProps);

    // Simulate user typing a comment
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Great product!' } });

    // Submit the form
    fireEvent.submit(screen.getByTestId('form'));

    // Ensure onSubmit was called with the expected data
    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    expect(onSubmitMock).toHaveBeenCalledWith({
      comment: 'Great product!',
      id: '12345',
      orderId: '12345'
    });

    // Ensure the form was reset
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('User should update feedback', () => {
    render(<FeedbackForm title="Update your review" onSubmit={vi.fn()} updateData={undefined} orderId={'1234'} />);
  });
});
