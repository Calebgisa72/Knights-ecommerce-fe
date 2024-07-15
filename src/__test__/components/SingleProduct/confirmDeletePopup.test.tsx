import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDeletePopup from '../../../components/SingleProduct/ConfirmDeletePopup';
import { vi } from 'vitest';

describe('ConfirmDeletePopup', () => {
  const mockFeedback = {
    id: '1',
    comment: 'Great product!',
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2021-01-01T00:00:00.000Z',
    orderId: '12345'
  };

  it('renders the delete trigger', () => {
    render(<ConfirmDeletePopup feedback={mockFeedback} onDelete={vi.fn()} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('opens the popup when the delete trigger is clicked', () => {
    render(<ConfirmDeletePopup feedback={mockFeedback} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this feedback?')).toBeInTheDocument();
  });

  it('closes the popup when the cancel button is clicked', () => {
    render(<ConfirmDeletePopup feedback={mockFeedback} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure you want to delete this feedback?')).not.toBeInTheDocument();
  });
});
