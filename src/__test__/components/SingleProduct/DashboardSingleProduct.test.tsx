import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../../../redux/store';
import DashboardSingleProduct from '../../../components/Products/DashboardSingleProduct/DashboardSingleProduct';
import { setProduct } from '../../../redux/reducers/getSingleProductReducer';
import { describe, it, vi, beforeAll } from 'vitest';
import { decodedToken } from '../../../services/jwtOperation';
import { Product } from '../../../types/productTypes';
import { DecodedToken } from '../../../pages/Authentication/Login';

vi.mock('axios');
vi.mock('../../../services/jwtOperation');

const mockedProduct: Product = {
  id: '1',
  name: 'Product 1',
  images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
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
  expirationDate: '2029-09-06T14:00:00.000Z',
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

const mockedDecodedToken: DecodedToken = {
  id: '1',
  email: 'test@test.com',
  role: 'vendor',
  iat: 12345,
  exp: 12345
};

describe('DashboardSingleProduct component', () => {
  beforeAll(() => {
    vi.resetAllMocks();
    store.dispatch(setProduct(mockedProduct));
    (decodedToken as jest.Mock).mockReturnValue(mockedDecodedToken);
  });

  it('should fetch single product', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <DashboardSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const productTitle = screen.getByText('Product Details');
      expect(productTitle).toBeInTheDocument();
      const productName = screen.getByText(mockedProduct.name);
      expect(productName).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    store.dispatch(setProduct({ ...mockedProduct }));

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DashboardSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    const loadingText = screen.getByText('Loading...');
    expect(loadingText).toBeInTheDocument();
  });

  it('should display feedbacks correctly', async () => {
    const feedbacks = [
      {
        id: '1',
        name: 'John Doe',
        description: 'Great product!',
        date: '2023-01-01'
      },
      {
        id: '2',
        name: 'Jane Smith',
        description: 'Decent quality.',
        date: '2023-01-02'
      }
    ];

    const productWithFeedbacks = {
      ...mockedProduct,
      feedbacks
    };

    store.dispatch(setProduct(productWithFeedbacks));

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DashboardSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      feedbacks.forEach((feedback) => {
        expect(screen.getByText(feedback.name)).toBeInTheDocument();
        expect(screen.getByText(feedback.description)).toBeInTheDocument();
        expect(screen.getByText(feedback.date)).toBeInTheDocument();
      });
    });
  });
});
