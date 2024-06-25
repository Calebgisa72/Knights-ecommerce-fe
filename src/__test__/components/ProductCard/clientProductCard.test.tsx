import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import ClientProductCard, { ProductProp } from '../../../components/Products/ProductCard/ClientProductCard';

describe('ClientProductCard Component', () => {
  const sampleProduct: ProductProp = {
    categories: [
      {
        name: 'cat1',
        id: 'testId',
        updatedAt: new Date(),
        createdAt: new Date(),
        products: [
          {
            id: 'testId'
          }
        ]
      }
    ],
    createdAt: new Date(),
    description: 'Description',
    images: ['image.jpg'],
    isAvailable: true,
    name: 'product',
    newPrice: '2000',
    quantity: '2',
    updatedAt: new Date(),
    vendor: {
      firstName: 'seller',
      lastName: 'sellerLastName'
    }
  };

  it('renders product name', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ClientProductCard product={sampleProduct} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(sampleProduct.name)).toBeInTheDocument();
  });

  it('renders category name if present', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ClientProductCard product={sampleProduct} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(sampleProduct.categories[0].name)).toBeInTheDocument();
  });

  it('renders vendor name', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ClientProductCard product={sampleProduct} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('sellerLastName seller')).toBeInTheDocument();
  });

  it('renders price', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ClientProductCard product={sampleProduct} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('RWF 2000')).toBeInTheDocument();
  });
});
