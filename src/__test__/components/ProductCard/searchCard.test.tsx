import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SearchCard, { Product } from '../../../components/Products/ProductCard/SearchCard';

describe('SearchCard', () => {
  const mockProductList: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      price: 100,
      owner: 'John Doe',
      image: 'image1.jpg'
    },
    {
      id: '2',
      name: 'Product 2',
      price: 200,
      owner: 'Jane Doe',
      image: 'image2.jpg'
    }
  ];

  it('renders the product names', () => {
    render(
      <Router>
        <SearchCard productList={mockProductList} />
      </Router>
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('renders the product prices', () => {
    render(
      <Router>
        <SearchCard productList={mockProductList} />
      </Router>
    );

    expect(screen.getByText('RWF 100')).toBeInTheDocument();
    expect(screen.getByText('RWF 200')).toBeInTheDocument();
  });

  it('renders the product owners', () => {
    render(
      <Router>
        <SearchCard productList={mockProductList} />
      </Router>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('renders the product images', () => {
    render(
      <Router>
        <SearchCard productList={mockProductList} />
      </Router>
    );

    expect(screen.getByAltText('Product 1')).toHaveAttribute('src', 'image1.jpg');
    expect(screen.getByAltText('Product 2')).toHaveAttribute('src', 'image2.jpg');
  });
});
