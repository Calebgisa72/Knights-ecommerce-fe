import { it, expect, describe, vi, beforeEach } from 'vitest';
import fetchWishlist from '../../../utils/wishlistFunctions/fetchWishlist';
import axios from 'axios';
import handleError from '../../../utils/errorHandler';
import { setWishlist } from '../../../redux/reducers/wishlistReducer';

vi.mock('axios');
vi.mock('../../../utils/errorHandler');
vi.mock('../../redux/reducers/wishlistReducer');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchWishlist', () => {
  const mockDispatch = vi.fn();
  const userToken = 'mockToken';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches and sets wishlist on successful response', async () => {
    const mockProducts = [
      {
        wishListDetails: {
          createdAt: Date.now(),
          id: '1',
          productId: '1'
        },
        productInfo: {
          id: '1',
          name: 'Product 1',
          images: ['image1.jpg'],
          categories: [{ name: 'Category 1' }],
          newPrice: 100,
          oldPrice: 120,
          updatedAt: new Date(),
          vendor: {
            firstName: 'string',
            lastName: 'Name',
            status: 'active'
          }
        }
      },
      {
        wishListDetails: {
          createdAt: Date.now(),
          id: '2',
          productId: '2'
        },
        productInfo: {
          id: '2',
          name: 'Product 2',
          images: ['image2.jpg'],
          categories: [{ name: 'Category 2' }],
          newPrice: 200,
          oldPrice: 220,
          updatedAt: new Date(),
          vendor: {
            firstName: 'string',
            lastName: 'Name',
            status: 'active'
          }
        }
      }
    ];

    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { productsForBuyer: mockProducts }
    });

    await fetchWishlist(userToken, mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith(setWishlist(mockProducts));
  });

  it('does not dispatch if wishlist is empty', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { message: 'No products in wish list' }
    });

    await fetchWishlist(userToken, mockDispatch);

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('handles errors correctly', async () => {
    const mockError = new Error('Network Error');
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await fetchWishlist(userToken, mockDispatch);

    expect(handleError).toHaveBeenCalledWith(mockError);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
