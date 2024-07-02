import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import store from '../../../redux/store';
import { Provider } from 'react-redux';
import ClientProductCard, { ProductProp } from '../../../components/Products/ProductCard/ClientProductCard';
describe('Home( landing page) test', () => {
  beforeAll(() => {});
  it('renders the Home Page', () => {
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
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ClientProductCard product={sampleProduct} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(sampleProduct.name)).toBeInTheDocument();
  });
});
