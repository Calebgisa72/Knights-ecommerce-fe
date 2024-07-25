import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import WishlistPage from '../../pages/WishlistPage/WishlistPage';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import axios from 'axios';
import { vi } from 'vitest';
import { setOnWishlistPage, setWishlist } from '../../redux/reducers/wishlistReducer';
import { setCredentials } from '../../redux/reducers/authReducer';
import { BrowserRouter } from 'react-router-dom';

vi.mock('axios');
vi.mock('../../utils/errorHandler');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const userToken = 'Testing Login';

const mockProducts = [
  {
    wishListDetails: {
      createdAt: new Date(),
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
      createdAt: new Date(),
      description: '',
      isAvailable: false,
      quantity: ''
    }
  },
  {
    wishListDetails: {
      createdAt: new Date(),
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
      createdAt: new Date(),
      description: '',
      isAvailable: false,
      quantity: ''
    }
  },
  {
    wishListDetails: {
      createdAt: new Date(),
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
      createdAt: new Date(),
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

  it('should tell if there are no products in wishlist', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <WishlistPage />
        </Provider>
      </BrowserRouter>
    );

    const paragraph = await screen.findByText(/wishlist is empty/i);
    expect(paragraph).toBeInTheDocument();

    const clearAllButton = screen.queryByText(/Clear All/i);
    expect(clearAllButton).not.toBeInTheDocument();
  });

  it('renders wishlist page with products', async () => {
    store.dispatch(setWishlist(mockProducts));

    render(
      <BrowserRouter>
        <Provider store={store}>
          <WishlistPage />
        </Provider>
      </BrowserRouter>
    );

    const heading = await screen.findByRole('heading', { name: 'Wishlist' });
    expect(heading).toBeInTheDocument();

    waitFor(() => {
      expect(screen.getAllByTestId('productDiv').length).toBe(3);

      mockProducts.forEach((product) => {
        expect(screen.getByText(product.productInfo.name)).toBeInTheDocument();
      });

      const beatLoader = screen.getByTestId('loaderDiv');
      const deleteButtons = screen.getAllByTestId('deleteButton');

      expect(deleteButtons[0]).toBeInTheDocument();
      expect(beatLoader).not.toBeInTheDocument();
      fireEvent.click(deleteButtons[0]);
      expect(beatLoader).toBeInTheDocument();
    });
  });

  it('calls clearAll when the "Clear All" button is clicked', async () => {
    store.dispatch(setWishlist(mockProducts));

    render(
      <BrowserRouter>
        <Provider store={store}>
          <WishlistPage />
        </Provider>
      </BrowserRouter>
    );

    const clearAllButton = await screen.findByText(/Clear All/i);
    expect(clearAllButton).toBeInTheDocument();

    fireEvent.click(clearAllButton);
  });
});
