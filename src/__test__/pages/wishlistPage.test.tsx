import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import WishlistPage from '../../pages/WishlistPage/WishlistPage';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import axios from 'axios';
import { vi } from 'vitest';
import { setOnWishlistPage, setWishlist } from '../../redux/reducers/wishlistReducer';
import { setCredentials } from '../../redux/reducers/authReducer';

vi.mock('axios');
vi.mock('../../utils/errorHandler');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const userToken = 'Testing Login';

const mockProducts = [
  {
    wishListDetails: {
      createdAt: new Date(Date.now()),
      id: 1,
      productId: '1'
    },
    productInfo: {
      id: '1',
      name: 'Product 1',
      images: ['image1.jpg'],
      categories: [],
      newPrice: '100',
      oldPrice: '120',
      updatedAt: new Date(),
      createdAt: new Date(Date.now()),
      description: '',
      isAvailable: false,
      quantity: ''
    }
  },
  {
    wishListDetails: {
      createdAt: new Date(Date.now()),
      id: 2,
      productId: '2'
    },
    productInfo: {
      id: '2',
      name: 'Product 2',
      images: ['image2.jpg'],
      categories: [],
      newPrice: '200',
      oldPrice: '220',
      updatedAt: new Date(),
      createdAt: new Date(Date.now()),
      description: '',
      isAvailable: false,
      quantity: ''
    }
  },
  {
    wishListDetails: {
      createdAt: new Date(Date.now()),
      id: 3,
      productId: '3'
    },
    productInfo: {
      id: '3',
      name: 'Product 3',
      images: ['image3.jpg'],
      categories: [],
      newPrice: '200',
      oldPrice: '220',
      updatedAt: new Date(),
      createdAt: new Date(Date.now()),
      description: '',
      isAvailable: false,
      quantity: ''
    }
  }
];

describe('WishlistPage', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { productsForBuyer: mockProducts }
    });
    store.dispatch(setOnWishlistPage(true));
    store.dispatch(setCredentials(userToken));
    vi.resetAllMocks();
  });

  it('should tell if there are no products in wishlist', () => {
    render(
      <Provider store={store}>
        <WishlistPage />
      </Provider>
    );

    const paragraph = screen.getByText(/wishlist is empty/i);
    expect(paragraph).toBeInTheDocument();

    const clearAllButton = screen.queryByText(/Clear All/i);
    expect(clearAllButton).not.toBeInTheDocument();
  });

  it('renders wishlist page with products', async () => {
    store.dispatch(setWishlist(mockProducts));

    render(
      <Provider store={store}>
        <WishlistPage />
      </Provider>
    );

    const heading = await screen.findByRole('heading', { name: 'Wishlist' });
    expect(heading).toBeInTheDocument();

    expect(screen.getAllByTestId('productDiv').length).toBe(3);

    mockProducts.forEach((product) => {
      expect(screen.getByText(product.productInfo.name)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTestId('deleteButton');

    expect(deleteButtons[0]).toBeInTheDocument();
    fireEvent.click(deleteButtons[0]);
  });

  it('calls clearAll when the "Clear All" button is clicked', async () => {
    store.dispatch(setWishlist(mockProducts));

    render(
      <Provider store={store}>
        <WishlistPage />
      </Provider>
    );

    const clearAllButton = await screen.findByText(/Clear All/i);
    expect(clearAllButton).toBeInTheDocument();

    fireEvent.click(clearAllButton);
  });
});
