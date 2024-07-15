import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ConfirmDeletePopup from '../../../components/Popups/ConfirmDeletePopup';

describe('ConfirmDeletePopup', () => {
  const mockOnSubmit = vi.fn();
  const props = {
    trigger: <button>Delete</button>,
    title: 'Confirm Delete',
    body: 'Are you sure you want to delete this item?',
    onSubmit: mockOnSubmit,
    submitText: 'Yes',
    closeText: 'No'
  };

  it('renders the trigger element', () => {
    render(<ConfirmDeletePopup {...props} />);
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('opens the popup when the trigger is clicked', () => {
    render(<ConfirmDeletePopup {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(screen.getByText(/confirm delete/i)).toBeInTheDocument();
  });

  it('calls onSubmit when the confirm button is clicked', () => {
    render(<ConfirmDeletePopup {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    fireEvent.click(screen.getByRole('button', { name: /yes/i }));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('closes the popup when the close button is clicked', () => {
    render(<ConfirmDeletePopup {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    fireEvent.click(screen.getByRole('button', { name: /no/i }));
    expect(screen.queryByText(/confirm delete/i)).not.toBeInTheDocument();
  });
});
