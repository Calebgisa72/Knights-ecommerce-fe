import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it } from 'vitest';
import DashboardEditProducts from '../../../components/Products/DashboardEditProducts/DashboardEditProducts';
import { render } from '../../utils/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import mockStore from '../../utils/mockStore';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DashboardEditProducts', () => {
  it('displays product details when data is fetched successfully', async () => {
    const categories = [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: { categories } });

    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/vendor/dashboard/products/1?app_env=test']}>
          <DashboardEditProducts />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Product Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Quantity')).toBeInTheDocument();
      expect(screen.getByText('Expiration Date')).toBeInTheDocument();
      expect(screen.getByText('New Price (Rwf)')).toBeInTheDocument();
      expect(screen.getByText('Old Price (Rwf)')).toBeInTheDocument();
      expect(screen.getByText('Image Upload')).toBeInTheDocument();

      categories.forEach((category) => {
        expect(screen.getByText(category.name)).toBeInTheDocument();
      });
    });
  });
  it('displays an error message when fetching categories fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Error fetching categories'));

    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/vendor/dashboard/products/1?app_env=test']}>
          <DashboardEditProducts />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      // Check for error message
      expect(screen.getByText((content) => content.includes('Error fetching categories'))).toBeInTheDocument();
    });
  });
  it('submits the form successfully with valid data', async () => {
    const categories = [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: { categories } });
    // mockedUpdateProduct.mockResolvedValueOnce({ message: 'Product updated successfully' });

    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/vendor/dashboard/products/1?app_env=test']}>
          <DashboardEditProducts />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Product Name')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('product-name'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('description'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('quantity'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('new-price'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('expiration-date'), { target: { value: '' } });

    fireEvent.click(screen.getByTestId('update-button'));

    await waitFor(() => {
      expect(screen.getByText('Product name must be at least 3 characters long.')).toBeInTheDocument();
      expect(screen.getByText('Description must be at least 3 characters long.')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid quantity.')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid price.')).toBeInTheDocument();
      expect(screen.getByText('You need an expiry date')).toBeInTheDocument();
    });
  });
});
