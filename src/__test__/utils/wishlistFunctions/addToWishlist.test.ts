import { it, expect, describe, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { addProductToWishlist } from '../../../utils/wishlistFunctions/addProduct';
import handleError from '../../../utils/errorHandler';
import { setWishlist } from '../../../redux/reducers/wishlistReducer';
import toast from 'react-hot-toast';
import { prodInWishlistProps } from '../../../redux/reducers/wishlistReducer';
import { ProductProp } from '../../../components/Products/ProductCard/ClientProductCard';

vi.mock('axios');
vi.mock('../../../utils/errorHandler');
vi.mock('../../../redux/reducers/wishlistReducer');
vi.mock('react-hot-toast');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockSetLoading = vi.fn();

describe('addProductToWishlist', () => {
  const mockDispatch = vi.fn();
  const userToken = 'mockToken';
  const product: ProductProp = {
    id: '1',
    name: 'Product 1',
    images: ['image1.jpg'],
    categories: [
      {
        name: 'cat1',
        id: '1',
        createdAt: new Date(),
        products: [{ id: '1' }],
        updatedAt: new Date()
      }
    ],
    newPrice: '100',
    oldPrice: '120',
    updatedAt: new Date(),
    createdAt: new Date(),
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
        createdAt: new Date(),
        id: 1,
        productId: '1'
      },
      productInfo: product
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('successfully adds product to wishlist', async () => {
    const wishlistAdded = {
      createdAt: new Date(),
      id: 2,
      productId: '1'
    };
    mockedAxios.post.mockResolvedValueOnce({
      status: 201,
      data: { data: { wishlistAdded } }
    });

    await addProductToWishlist(userToken, mockDispatch, products, product, mockSetLoading);

    expect(mockDispatch).toHaveBeenCalledWith(
      setWishlist([
        {
          productInfo: { ...product },
          wishListDetails: wishlistAdded
        },
        ...products
      ])
    );
    expect(toast.success).toHaveBeenCalledWith(`${product.name} added to wishlist`);
  });

  it('handles errors correctly', async () => {
    const mockError = new Error('Network Error');
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await addProductToWishlist(userToken, mockDispatch, products, product, mockSetLoading);

    expect(handleError).toHaveBeenCalledWith(mockError);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
