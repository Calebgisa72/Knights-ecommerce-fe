import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it } from 'vitest'; // Assuming 'vitest' is your testing framework
import DeleteCouponModal from '../../../components/Products/DashboardDeleteProduct/DashboardDeleteProduct'; // Adjust the import path as per your project structure
import { render } from '../../utils/test-utils'; // Adjust the path as per your project structure
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import mockStore from '../../utils/mockStore'; // Adjust the path as per your project structure

describe('DeleteCouponModal', () => {
  it('renders correctly with modal content', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <DeleteCouponModal />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Delete coupon FLAT10!')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to accept this?')).toBeInTheDocument();
    expect(screen.getByText('No, Cancel')).toBeInTheDocument();
    expect(screen.getByText('Yes, Deactivate')).toBeInTheDocument();
  });

  it('triggers cancel action when "No, Cancel" button is clicked', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <DeleteCouponModal />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('No, Cancel'));
  });
});
