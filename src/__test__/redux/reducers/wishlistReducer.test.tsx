import wishlistReducer, { setWishlist, setOnWishlistPage } from '../../../redux/reducers/wishlistReducer';
import { prodInWishlistProps } from '../../../redux/reducers/wishlistReducer';

describe('wishlistReducer', () => {
  let initialState: { products: prodInWishlistProps[]; onWihlistPage: boolean };

  beforeEach(() => {
    initialState = {
      products: [],
      onWihlistPage: false
    };
  });

  it('should return the initial state when given an undefined state', () => {
    expect(wishlistReducer(undefined, { type: 'undefined' })).toEqual(initialState);
  });

  it('should handle setWishlist action', () => {
    const mockProducts: prodInWishlistProps[] = [
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
          quantity: '',
          vendor: {
            firstName: 'seller',
            lastName: 'sellerLastName',
            status: 'active'
          }
        }
      }
    ];

    const newState = wishlistReducer(initialState, setWishlist(mockProducts));
    expect(newState).toEqual({
      products: mockProducts,
      onWihlistPage: false
    });
  });

  it('should handle setOnWishlistPage action', () => {
    const newState = wishlistReducer(initialState, setOnWishlistPage(true));
    expect(newState).toEqual({
      products: [],
      onWihlistPage: true
    });
  });

  it('should handle setOnWishlistPage action to false', () => {
    const newState = wishlistReducer({ ...initialState, onWihlistPage: true }, setOnWishlistPage(false));
    expect(newState).toEqual({
      products: [],
      onWihlistPage: false
    });
  });
});
