import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackFormPopup from '../../../components/Popups/FeedbackFormPopup';
import FeedbackForm from '../../../components/Forms/FeedbackForm';
import { FeedbackFormPopupProps } from '../../../types/FeedbackTypes';
import { PopupProps } from '../../../types/CouponTypes';

// Setup function for rendering the FeedbackFormPopup with default props
const setup = (props: Partial<FeedbackFormPopupProps> = {}) => {
  const defaultProps: FeedbackFormPopupProps = {
    trigger: <button data-testid="popup-trigger">Open Popup</button>,
    title: 'Feedback Form',
    body: <FeedbackForm onSubmit={vi.fn()} orderId="12345" title="Feedback Form body" />,
    onSubmit: vi.fn(),
    onClose: vi.fn(),
    submitText: 'Submit',
    closeText: 'Close',
    ...props
  };

  return render(<FeedbackFormPopup {...defaultProps} />);
};

const defaultProps: PopupProps = {
  title: 'Test Title',
  subtitle: 'Test Subtitle',
  responseType: 'success',
  duration: 3000,
  onClose: vi.fn()
};

describe('FeedbackFormPopup', () => {
  it('renders the trigger button', () => {
    setup();
    expect(screen.getByTestId('popup-trigger')).toBeInTheDocument();
  });

  it('opens the popup when the trigger is clicked', async () => {
    setup();
    userEvent.click(screen.getByTestId('popup-trigger'));
    expect(await screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('closes the popup when the close button is clicked', async () => {
    setup();
    userEvent.click(screen.getByTestId('popup-trigger'));
    userEvent.click(screen.getByText('Close'));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('calls onSubmit with the correct data when the form is submitted', async () => {
    const onSubmit = vi.fn();
    render(
      <FeedbackFormPopup
        trigger={<p>Submit</p>}
        {...defaultProps}
        body={<FeedbackForm title="Hello" orderId="123" />}
        onSubmit={onSubmit}
      />
    );
    fireEvent.click(screen.getByText('Submit'));
  });
});
