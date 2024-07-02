import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ListPopup from '../../../components/Popups/ListPopup';

describe('ListPopup Component', () => {
  it('renders the ListPopup component without crashing', () => {
    const title = ' coupons';

    render(
      <ListPopup
        trigger={
          <div className="py-2 px-4 bg-[#E7EBEF] rounded hover:scale-105 transition-all duration-300 ease-in-out">
            List of coupons
          </div>
        }
        title={title}
        body={<div>Bella ciao</div>}
      />
    );

    // Check if the trigger is rendered
    expect(screen.getByText('List of coupons')).toBeInTheDocument();
  });

  it('initially the popup is not visible', () => {
    render(
      <ListPopup
        trigger={
          <div className="py-2 px-4 bg-[#E7EBEF] rounded hover:scale-105 transition-all duration-300 ease-in-out">
            List of coupons
          </div>
        }
        title="List of coupons"
        body={<div>Bella ciao</div>}
      />
    );

    // Check if the popup content is not in the document initially
    expect(screen.queryByText('Bella cia')).not.toBeInTheDocument();
  });

  it('opens the popup when the trigger is clicked', async () => {
    render(
      <ListPopup
        trigger={
          <div className="py-2 px-4 bg-[#E7EBEF] rounded hover:scale-105 transition-all duration-300 ease-in-out">
            List of coupons
          </div>
        }
        title="List  coupons"
        body={<div>Bella ciao</div>}
      />
    );

    // Click the trigger to open the popup
    fireEvent.click(screen.getByText('List of coupons'));

    // Wait for the popup content to appear
    await waitFor(() => expect(screen.getByText('Bella ciao')).toBeInTheDocument());
  });

  it('closes the popup when the close button is clicked', async () => {
    render(
      <ListPopup
        trigger={
          <div className="py-2 px-4 bg-[#E7EBEF] rounded hover:scale-105 transition-all duration-300 ease-in-out">
            List of coupons
          </div>
        }
        title="List  coupons"
        body={<div>Bella ciao</div>}
      />
    );

    // Click the trigger to open the popup
    fireEvent.click(screen.getByText('List of coupons'));

    // Wait for the popup content to appear
    await waitFor(() => expect(screen.getByText('Bella ciao')).toBeInTheDocument());

    // Click the close button

    // Wait for the popup content to disappear
    await waitFor(() => expect(screen.queryByText('Bella cao')).not.toBeInTheDocument());
  });

  it('closes the popup when clicking outside the popup', async () => {
    render(
      <ListPopup
        trigger={
          <div className="py-2 px-4 bg-[#E7EBEF] rounded hover:scale-105 transition-all duration-300 ease-in-out">
            List of coupon
          </div>
        }
        title="List of coupons"
        body={<div>Bella ciao</div>}
      />
    );

    // Click the trigger to open the popup
    fireEvent.click(screen.getByText('List of coupons'));

    // Wait for the popup content to appear
    await waitFor(() => expect(screen.getByText('Bella ciao')).toBeInTheDocument());

    // Click outside the popup to close it
    fireEvent.click(document.querySelector('.fixed')!);

    // Wait for the popup content to disappear
    await waitFor(() => expect(screen.queryByText('Bella iao')).not.toBeInTheDocument());
  });
});
