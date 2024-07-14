import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import ClientProductCard, { ProductProp } from '../../../components/Products/ProductCard/ClientProductCard';
import { setCredentials } from '../../../redux/reducers/authReducer';
import { setOnWishlistPage, setWishlist } from '../../../redux/reducers/wishlistReducer';

const wishlistProduct = [
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

describe('product card on home page', () => {
  beforeAll(() => {
    vi.resetAllMocks();
    store.dispatch(setCredentials('userToken'));
    store.dispatch(setWishlist(wishlistProduct));
  });
  it('renders collectly when product is not in wishlist', () => {
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
        lastName: 'sellerLastName',
        status: 'active'
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
    expect(screen.getAllByTestId('productDiv').length).toBe(1);

    expect(screen.getByTestId('addButton')).toBeInTheDocument();
  });

  it('renders correctly when the product is in the wishlist', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ClientProductCard product={wishlistProduct[0].productInfo} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(wishlistProduct[0].productInfo.name)).toBeInTheDocument();
    expect(screen.getAllByTestId('productDiv').length).toBe(1);

    expect(screen.getByTestId('removeButton')).toBeInTheDocument();
  });
});

describe('product card on wishlist page', () => {
  beforeAll(() => {
    vi.resetAllMocks();
    store.dispatch(setCredentials('userToken'));
    store.dispatch(setWishlist(wishlistProduct));
    store.dispatch(setOnWishlistPage(true));
  });
  it('renders collectly when product is in wishlist and on wishlist page', () => {
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
    expect(screen.getAllByTestId('productDiv').length).toBe(1);

    expect(screen.getByTestId('deleteButton')).toBeInTheDocument();
  });
});
