import { configureStore } from '@reduxjs/toolkit';
import { Product, ProductState, SingleProductState } from '../../types/productTypes';
import { Coupon } from '../../types/CouponTypes';
import productReducer from '../../redux/reducers/productReducer';
import getSingleProductReducer from '../../redux/reducers/getSingleProductReducer';
import buyerOrdersReducer from '../../redux/reducers/buyerOrdersReducer';
import cartReducer from '../../redux/reducers/cartReducer';

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
      id: '1',
      name: 'Customer 1',
      description: 'Great product!',
      date: '2023-06-28'
    },
    {
      id: '2',
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
    discountRate: 20,
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

const mockOrders = [
  {
    id: '18e55105-4e19-4292-8c09-f47dcf963f76',
    totalPrice: '1350',
    orderStatus: 'completed',
    quantity: 3,
    address: 'Rwanda, Nyamirambo, KN 100 ST',
    orderDate: '2024-07-10T22:25:16.599Z',
    createdAt: '2024-07-10T23:25:16.601Z',
    updatedAt: '2024-07-10T23:26:32.226Z',
    buyer: {
      id: 'b08a02ae-021c-48b0-983b-b6335b589eeb',
      firstName: 'Client',
      lastName: 'Doe',
      accountBalance: '0.00'
    },
    orderItems: [
      {
        id: '4bdb8d54-8508-45c5-af8a-7035c289cfa2',
        price: '450',
        quantity: 3,
        product: {
          id: '92a3bc17-c3a5-42e0-a543-7635feb326de',
          name: 'Sumsung',
          description: 'Sumsung',
          images: [
            'https://res.cloudinary.com/dqcb26re7/image/upload/v1720650039/dmrywzxqk2q4bkh7dybk.png',
            'https://res.cloudinary.com/dqcb26re7/image/upload/v1720650040/jssmwjhritszcejwiitl.png'
          ],
          price: '450',
          expirationDate: null
        }
      }
    ]
  }
];

const mockCart = [
  {
    totalAmount: '450',
    isCheckedOut: false,
    id: '010060ec-be3d-4f18-85e1-06123d66bd20',
    createdAt: '2024-07-12T16:05:10.408Z',
    updatedAt: '2024-07-12T16:11:12.571Z',
    items: [
      {
        id: 'b1e20a5f-3f87-47bd-a787-e4f03fdc6130',
        newPrice: '450',
        quantity: 1,
        total: '450',
        createdAt: '2024-07-12T16:05:10.429Z',
        updatedAt: '2024-07-12T16:09:47.999Z',
        product: {
          id: '92a3bc17-c3a5-42e0-a543-7635feb326de',
          name: 'Sumsung',
          description: 'Sumsung  ',
          images: [
            'https://res.cloudinary.com/dqcb26re7/image/upload/v1720650039/dmrywzxqk2q4bkh7dybk.png',
            'https://res.cloudinary.com/dqcb26re7/image/upload/v1720650040/jssmwjhritszcejwiitl.png'
          ],
          newPrice: '450',
          oldPrice: null,
          expirationDate: null,
          quantity: 86,
          isAvailable: true,
          createdAt: '2024-07-10T23:20:41.400Z',
          updatedAt: '2024-07-10T23:25:16.601Z'
        }
      }
    ],
    user: 'b08a02ae-021c-48b0-983b-b6335b589eeb'
  }
];
const ordersState: any = {
  orders: mockOrders,
  loading: false,
  error: null
};
const cartsState: any = {
  cart: mockCart,
  loading: false,
  error: null
};

// Mock store setup
const singleProductState: SingleProductState = {
  product: product, // Include the product with feedbacks
  loading: false,
  error: null
};

const productState: ProductState = {
  products: null,
  message: '',
  coupons: mockCoupons, // Provide mock coupons data
  loading: false,
  error: null
};

const mockStore = configureStore({
  reducer: {
    products: productReducer,
    singleProduct: getSingleProductReducer,
    buyerOrders: buyerOrdersReducer, // Add ordersReducer to the store,
    cart: cartReducer
  },
  preloadedState: {
    products: productState,
    singleProduct: singleProductState,
    buyerOrders: ordersState, // Include ordersState in preloadedState
    cart: cartsState
  }
});

export default mockStore;
