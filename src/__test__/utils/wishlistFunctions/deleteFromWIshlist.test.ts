import { it, expect, describe, vi, beforeEach } from 'vitest';
import axios from 'axios';
import deleteWishlistProduct from '../../../utils/wishlistFunctions/deleteWishlistProduct';
import handleError from '../../../utils/errorHandler';
import { setWishlist } from '../../../redux/reducers/wishlistReducer';
import toast from 'react-hot-toast';
import { prodInWishlistProps } from '../../../redux/reducers/wishlistReducer';
import { ProductProp } from '../../../components/Products/ProductCard/ClientProductCard';

vi.mock('axios');
vi.mock('../../../utils/errorHandler');
vi.mock('../../redux/reducers/wishlistReducer');
vi.mock('react-hot-toast');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('deleteWishlistProduct', () => {
  const mockDispatch = vi.fn();
  const mockSetInWishlist = vi.fn();
  const mockSetLoading = vi.fn();
  const userToken = 'mockToken';
  const product: ProductProp = {
    id: '1',
    name: 'Product 1',
    images: ['image1.jpg'],
    categories: [
      {
        name: 'cat1',
        id: '1',
        createdAt: new Date(Date.now()),
        products: [{ id: '1' }],
        updatedAt: new Date(Date.now())
      }
    ],
    newPrice: '100',
    oldPrice: '120',
    updatedAt: new Date(Date.now()),
    createdAt: new Date(Date.now()),
    description: '',
    isAvailable: false,
    quantity: '',
    vendor: {
      firstName: 'seller',
      lastName: 'sellerLastName',
      status: 'active'
    }
  };
  const products: prodInWishlistProps[] = [
    {
      wishListDetails: {
        createdAt: new Date(Date.now()),
        id: 1,
        productId: '1'
      },
      productInfo: product
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('successfully deletes product from wishlist', async () => {
    mockedAxios.delete.mockResolvedValueOnce({
      status: 200
    });

    await deleteWishlistProduct(userToken, mockDispatch, 1, products, mockSetInWishlist, product, mockSetLoading);

    expect(mockDispatch).toHaveBeenCalledWith(setWishlist([]));
    expect(mockSetInWishlist).toHaveBeenCalledWith(false);
    expect(toast.success).toHaveBeenCalledWith(`${product.name} successfully removed from wishlist`);
  });

  it('does not delete product if id is null', async () => {
    await deleteWishlistProduct(userToken, mockDispatch, null, products, mockSetInWishlist, product, mockSetLoading);

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockSetInWishlist).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(mockedAxios.delete).not.toHaveBeenCalled();
  });

  it('handles errors correctly', async () => {
    const mockError = new Error('Network Error');
    mockedAxios.delete.mockRejectedValueOnce(mockError);

    await deleteWishlistProduct(userToken, mockDispatch, 1, products, mockSetInWishlist, product, mockSetLoading);

    expect(handleError).toHaveBeenCalledWith(mockError);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockSetInWishlist).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
