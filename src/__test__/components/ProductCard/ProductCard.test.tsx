import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProductsCard from '../../../components/Products/ProductCard/ProductsCard';
import { Provider } from 'react-redux';
import store from '../../../redux/store';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'This is a test product',
  images: ['https://via.placeholder.com/150'],
  newPrice: '1000',
  oldPrice: null,
  expirationDate: '2023-12-31T00:00:00.000Z',
  quantity: 10,
  isAvailable: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  categories: [
    {
      id: '1',
      name: 'Category 1',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    }
  ],
  vendor: {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '1234567890',
    photoUrl: null
  }
};

describe('ProductsCard', () => {
  it('renders the ProductsCard component without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductsCard data={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    // Check if the product name is displayed
    expect(screen.getByText('Test Product')).toBeInTheDocument();

    // Check if the product category is displayed
    expect(screen.getByText('Category 1')).toBeInTheDocument();

    // Check if the product price is displayed
    expect(screen.getByText('1000 RWF')).toBeInTheDocument();

    // Check if the product description is displayed
    expect(screen.getByText('This is a test product')).toBeInTheDocument();

    // Check if the formatted expiration date is displayed
    expect(screen.getByText('12-31-2023')).toBeInTheDocument();
  });

  it('renders without crashing when no images are provided', () => {
    const mockProductWithoutImages = { ...mockProduct, images: [] };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductsCard data={mockProductWithoutImages} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByAltText('product-image')).toBeInTheDocument();
  });

  it('renders the correct category name', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductsCard data={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Category 1')).toBeInTheDocument();
  });

  it('renders without crashing when no images are provided', () => {
    const mockProductWithoutImages = { ...mockProduct, images: [] };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductsCard data={mockProductWithoutImages} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByAltText('product-image')).toBeInTheDocument();
  });

  it('renders the correct category name', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductsCard data={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Category 1')).toBeInTheDocument();
  });

  it('handles delete click and shows modal', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductsCard data={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    // Click the delete button
    fireEvent.click(screen.getByTestId('delete-button'));
    expect(screen.getByText(/Are you sure you want to delete the product/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('delete-confirmation'));
  });

  it('closes modal when cancel button is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductsCard data={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    // Click the delete button
    fireEvent.click(screen.getByTestId('delete-button'));

    // Click the cancel button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // Check if the modal is closed
    expect(screen.queryByText(/Are you sure you want to delete the product/i)).not.toBeInTheDocument();
  });
});
