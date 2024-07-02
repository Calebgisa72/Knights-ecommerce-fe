import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProductsCard from '../../../components/Products/ProductCard/ProductsCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'This is a test product',
  images: ['https://via.placeholder.com/150'],
  newPrice: '1000 Rwf',
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
      <MemoryRouter>
        <ProductsCard data={mockProduct} />
      </MemoryRouter>
    );

    // Check if the product name is displayed
    expect(screen.getByText('Test Product')).toBeInTheDocument();

    // Check if the product category is displayed
    expect(screen.getByText('Category 1')).toBeInTheDocument();

    // Check if the product price is displayed
    expect(screen.getByText('1000 Rwf')).toBeInTheDocument();

    // Check if the product description is displayed
    expect(screen.getByText('This is a test product')).toBeInTheDocument();

    // Check if the formatted expiration date is displayed
    expect(screen.getByText('12-31-2023')).toBeInTheDocument();

    // Check if the remaining quantity is displayed
    expect(screen.getByText('10')).toBeInTheDocument();

    // Check if the image is rendered
    expect(screen.getByAltText('product-image')).toBeInTheDocument();
  });
});
