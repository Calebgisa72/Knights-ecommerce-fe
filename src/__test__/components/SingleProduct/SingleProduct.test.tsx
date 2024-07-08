import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { BrowserRouter } from 'react-router-dom';
import { describe, it } from 'vitest';
import { setProduct } from '../../../redux/reducers/getSingleProductReducer';
import SingleProduct from '../../../components/SingleProduct/SingleProduct';
import { Product } from '../../../types/productTypes';

vi.mock('axios');

const mockedProduct: Product = {
  id: '1',
  name: 'Product 1',
  images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  categories: [
    {
      id: '1',
      name: 'Category 1',
      createdAt: '2022-02-22T13:00:00.000Z',
      updatedAt: '2022-02-22T13:00:00.000Z'
    }
  ],
  newPrice: '100',
  oldPrice: '120',
  expirationDate: '2022-09-06T14:00:00.000Z',
  updatedAt: '2022-02-22T13:00:00.000Z',
  createdAt: '2022-02-22T13:00:00.000Z',
  description: 'Mocked product description',
  isAvailable: false,
  quantity: 10,
  vendor: {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'mockedVendor@email.com',
    phoneNumber: '123456789',
    photoUrl: 'vendor.jpg'
  },
  feedbacks: []
};

describe('SingleProduct component', () => {
  beforeAll(() => {
    vi.resetAllMocks();
    store.dispatch(setProduct(mockedProduct));
  });

  it('should render SingleProduct component', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <SingleProduct />
        </Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const productName = screen.getAllByText('Product 1', { selector: 'h1' });
      expect(productName).toHaveLength(2);

      const pElement1 = screen.getByText('Home', { selector: 'p' });
      expect(pElement1).toBeInTheDocument();

      const pElement2 = screen.getByText('Collections', { selector: 'p' });
      expect(pElement2).toBeInTheDocument();

      const pElement3 = screen.getByText('John Doe', { selector: 'p' });
      expect(pElement3).toBeInTheDocument();

      const pElement4 = screen.getByText('Product 1', { selector: 'p' });
      expect(pElement4).toBeInTheDocument();

      const newPrice = screen.getByText('RWF100', { selector: 'p' });
      expect(newPrice).toBeInTheDocument();

      const oldPrice = screen.getByText('RWF120', { selector: 'p' });
      expect(oldPrice).toBeInTheDocument();

      const description = screen.getByText('Mocked product description', { selector: 'p' });
      expect(description).toBeInTheDocument();

      const h1Elemet = screen.getByText('Product Description', { selector: 'h1' });
      expect(h1Elemet).toBeInTheDocument();

      const category = screen.getByText('Category:', { selector: 'p' });
      expect(category).toBeInTheDocument();

      const categoryName = screen.getByText('Category 1', { selector: 'p' });
      expect(categoryName).toBeInTheDocument();

      const addToCartButton = screen.getByText('Add to Cart', {
        selector: 'button'
      });
      expect(addToCartButton).toBeInTheDocument();

      const inputElement = screen.getByRole('textbox');
      expect(inputElement).toBeInTheDocument();

      const imageElements = screen.getAllByRole('testRole');
      expect(imageElements.length).toBeGreaterThanOrEqual(4);
    });
  });
});
