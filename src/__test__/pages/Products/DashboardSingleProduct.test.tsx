import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it } from 'vitest';
import DashboardSingleProduct from '../../../components/Products/DashboardSingleProduct/DashboardSingleProduct';
import { render } from '../../utils/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import mockStore from '../../utils/mockStore';

describe('DashboardSingleProduct', () => {
  it('displays product details when data is fetched successfully', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/vendor/dashboard/products/1?app_env=test']}>
          <DashboardSingleProduct />
        </MemoryRouter>
      </Provider>,
      {
        route: '/vendor/dashboard/products/1/app_env=test',
        path: '/vendor/dashboard/products/:id/:app_env'
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Product Details')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Category 1, Category 2')).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByAltText('Product Image 1')).toBeInTheDocument();
      expect(screen.getByAltText('Product Image 2')).toBeInTheDocument();
      expect(screen.getByText('Customer 1')).toBeInTheDocument();
      expect(screen.getByText('Great product!')).toBeInTheDocument();
      expect(screen.getByText('Customer 2')).toBeInTheDocument();
      expect(screen.getByText('Not bad.')).toBeInTheDocument();
    });
  });

  it('handles coupon creation and displays list of coupons', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/vendor/dashboard/products/1?app_env=test']}>
          <DashboardSingleProduct />
        </MemoryRouter>
      </Provider>,
      {
        route: '/vendor/dashboard/products/1/app_env=test',
        path: '/vendor/dashboard/products/:id/:app_env'
      }
    );

    await waitFor(() => expect(screen.getByText('Product Details')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Create New Coupon'));

    // Simulate form submission
    fireEvent.click(screen.getByText('Add Coupon'));

    await waitFor(() => expect(screen.getByText('Product Details')).toBeInTheDocument());
  });

  it('displays customer feedback', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/vendor/dashboard/products/1?app_env=test']}>
          <DashboardSingleProduct />
        </MemoryRouter>
      </Provider>,
      {
        route: '/vendor/dashboard/products/1/app_env=test',
        path: '/vendor/dashboard/products/:id/:app_env'
      }
    );
    await waitFor(() => expect(screen.getByText('Customer Feedback')).toBeInTheDocument());

    expect(screen.getByText('Customer 1')).toBeInTheDocument();
    expect(screen.getByText('Great product!')).toBeInTheDocument();
    expect(screen.getByText('Customer 2')).toBeInTheDocument();
    expect(screen.getByText('Not bad.')).toBeInTheDocument();
  });
});
