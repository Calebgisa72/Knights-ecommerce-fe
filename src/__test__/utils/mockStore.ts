import { configureStore } from '@reduxjs/toolkit';
import { Product, ProductState, SingleProductState } from '../../types/productTypes';
import { Coupon } from '../../types/CouponTypes';
import productReducer from '../../redux/reducers/productReducer';
import getSingleProductReducer from '../../redux/reducers/getSingleProductReducer';

const product: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  categories: [
    {
      name: 'Category 1',
      id: '',
      createdAt: '',
      updatedAt: ''
    },
    {
      name: 'Category 2',
      id: '',
      createdAt: '',
      updatedAt: ''
    }
  ],
  isAvailable: true,
  quantity: 100,
  newPrice: '50',
  oldPrice: '50',
  images: ['image1.jpg', 'image2.jpg'],
  feedbacks: [
    {
      name: 'Customer 1',
      description: 'Great product!',
      date: '2023-06-28'
    },
    {
      name: 'Customer 2',
      description: 'Not bad.',
      date: '2023-06-29'
    }
  ],
  expirationDate: '',
  createdAt: '',
  updatedAt: '',
  vendor: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    photoUrl: null
  }
};

const mockCoupons: Coupon[] = [
  {
    id: 'coupon1',
    code: 'DISCOUNT10',
    discountType: 'percentage',
    discountRate: 10,
    expirationDate: '2023-12-31T00:00:00.000Z',
    maxUsageLimit: 100,
    product: {
      id: 'product123',
      name: 'Sample Product',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      images: ['image1.jpg', 'image2.jpg'],
      newPrice: '99.99',
      oldPrice: '129.99',
      expirationDate: '2023-12-31T00:00:00.000Z',
      quantity: 100,
      isAvailable: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-06-01T00:00:00.000Z',
      categories: [
        {
          id: 'category1',
          name: 'Category A',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        },
        {
          id: 'category2',
          name: 'Category B',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        }
      ],
      vendor: {
        id: 'vendor123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        photoUrl: null
      },
      feedbacks: []
    },
    usageTimes: 0,
    usedBy: [],
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 'coupon2',
    code: 'DISCOUNT20',
    discountType: 'percentage',
    discountRate: 10,
    expirationDate: '2023-12-31T00:00:00.000Z',
    maxUsageLimit: 100,
    product: {
      id: 'product123',
      name: 'Sample Product',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      images: ['image1.jpg', 'image2.jpg'],
      newPrice: '99.99',
      oldPrice: '129.99',
      expirationDate: '2023-12-31T00:00:00.000Z',
      quantity: 100,
      isAvailable: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-06-01T00:00:00.000Z',
      categories: [
        {
          id: 'category1',
          name: 'Category A',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        },
        {
          id: 'category2',
          name: 'Category B',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        }
      ],
      vendor: {
        id: 'vendor123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        photoUrl: null
      },
      feedbacks: []
    },
    usageTimes: 0,
    usedBy: [],
    createdAt: '',
    updatedAt: ''
  }
];
// Mock store setup
const singleProductState: SingleProductState = {
  product: null,
  loading: false,
  error: null
};
const productState: ProductState = {
  products: null,
  message: '',
  coupons: [],
  loading: false,
  error: null
};
const mockStore = configureStore({
  reducer: {
    products: productReducer,
    singleProduct: getSingleProductReducer
  },
  preloadedState: {
    products: {
      ...productState, // Include all fields from initial state
      coupons: mockCoupons // Provide mock coupons data
    },
    singleProduct: {
      ...singleProductState,
      product
    }
  }
});

export default mockStore;
