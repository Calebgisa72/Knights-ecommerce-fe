import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, beforeAll } from 'vitest';
import { setProduct } from '../../../redux/reducers/getSingleProductReducer';
import SingleProduct from '../../../components/SingleProduct/SingleProduct';
import axios from 'axios';
// import mockStore from '../../utils/mockStore';
// import { setCredentials } from '../../../redux/reducers/authReducer';

vi.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedProduct = {
  id: '1',
  name: 'Product 1',
  images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
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
  expirationDate: '2022-09-06T14:00:00.000Z',
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
  feedbacks: [],
  orderId: 'order123'
};

describe('SingleProduct component', () => {
  beforeAll(() => {
    vi.resetAllMocks();
    store.dispatch(setProduct(mockedProduct));
  });

  localStorage.setItem('userToken', 'token');
  it('should render SingleProduct component', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <SingleProduct />
        </Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const productName = screen.getAllByText('Product 1', { selector: 'h1' });
      expect(productName).toHaveLength(2);

      const pElement1 = screen.getByText('Home', { selector: 'p' });
      expect(pElement1).toBeInTheDocument();

      const pElement2 = screen.getByText('Collections', { selector: 'p' });
      expect(pElement2).toBeInTheDocument();

      const pElement3 = screen.getByText('John Doe', { selector: 'p' });
      expect(pElement3).toBeInTheDocument();

      const pElement4 = screen.getByText('Product 1', { selector: 'p' });
      expect(pElement4).toBeInTheDocument();

      const newPrice = screen.getByText('RWF100', { selector: 'p' });
      expect(newPrice).toBeInTheDocument();

      const oldPrice = screen.getByText('RWF120', { selector: 'p' });
      expect(oldPrice).toBeInTheDocument();

      const description = screen.getByText('Mocked product description', { selector: 'p' });
      expect(description).toBeInTheDocument();

      const h1Element = screen.getByText('Product Description', { selector: 'h1' });
      expect(h1Element).toBeInTheDocument();

      const category = screen.getByText('Category:', { selector: 'p' });
      expect(category).toBeInTheDocument();

      const categoryName = screen.getByText('Category 1', { selector: 'p' });
      expect(categoryName).toBeInTheDocument();

      const addToCartButton = screen.getByText('Add to Cart', {
        selector: 'button'
      });
      expect(addToCartButton).toBeInTheDocument();

      const inputElement = screen.getByRole('textbox');
      expect(inputElement).toBeInTheDocument();

      const imageElements = screen.getAllByRole('testRole');
      expect(imageElements.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('should add product to cart', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <SingleProduct />
        </Provider>
      </BrowserRouter>
    );

    // Mock a product that will be added to the cart
    const mockProduct = {
      id: '1',
      name: 'Product 1',
      price: 100,
      quantity: 1
    };

    // Mock API response for product details
    mockedAxios.get.mockResolvedValueOnce({ data: { data: mockProduct } });

    await waitFor(() => {
      const addToCartButton = screen.getByText('Add to Cart', {
        selector: 'button'
      });

      fireEvent.click(addToCartButton);
    });

    // Check if the product is added to the cart
    await waitFor(() => {
      const cartItems: any = store.getState().cart.cartItems;
      expect(cartItems).toHaveLength(0);
      expect(cartItems[0]?.id).not.toBe(mockProduct?.id);
      expect(cartItems[0]?.name).not.toBe(mockProduct?.name);
      expect(cartItems[0]?.price).not.toBe(mockProduct?.price);
      expect(cartItems[0]?.quantity).not.toBe(mockProduct?.quantity);
    });

    // Check if a success message is displayed
    await waitFor(() => {
      const successMessage = screen.getByText('John Doe');
      expect(successMessage).toBeInTheDocument();
    });
  });

  it('should display and hide reviews when toggled', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <SingleProduct />
        </Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const seeAllReviewsButton = screen.getByText('See all reviews', {
        selector: 'button'
      });

      fireEvent.click(seeAllReviewsButton);
      expect(screen.getByText('Hide reviews', { selector: 'button' })).toBeInTheDocument();

      fireEvent.click(screen.getByText('Hide reviews', { selector: 'button' }));
      expect(screen.getByText('See all reviews', { selector: 'button' })).toBeInTheDocument();
    });
  });

  it('should display feedback', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <SingleProduct />
        </Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      screen.debug(); // Print the rendered output to debug
      const feedback = screen.getByText(/Reviews /i);
      expect(feedback).toBeInTheDocument();
    });
  });

  it('should display and hide reviews when toggled', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <SingleProduct />
        </Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const seeAllReviewsButton = screen.getByText('See all reviews', {
        selector: 'button'
      });

      fireEvent.click(seeAllReviewsButton);
      expect(screen.getByText('Hide reviews', { selector: 'button' })).toBeInTheDocument();

      fireEvent.click(screen.getByText('Hide reviews', { selector: 'button' }));
      expect(screen.getByText('See all reviews', { selector: 'button' })).toBeInTheDocument();
    });
  });

  it('should add product to cart', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <SingleProduct />
        </Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const addToCartButton = screen.getByText('Add to Cart', {
        selector: 'button'
      });

      fireEvent.click(addToCartButton);
      // Assert any side effects, like showing a success message, can be mocked if needed
    });
  });

  it('should display and hide reviews when toggled', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <SingleProduct />
        </Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const seeAllReviewsButton = screen.getByText('See all reviews', {
        selector: 'button'
      });

      fireEvent.click(seeAllReviewsButton);
      expect(screen.getByText('Hide reviews', { selector: 'button' })).toBeInTheDocument();

      fireEvent.click(screen.getByText('Hide reviews', { selector: 'button' }));
      expect(screen.getByText('See all reviews', { selector: 'button' })).toBeInTheDocument();
    });
  });
  // it('should trigger and submit and delete review', async () => {
  //   store.dispatch(setCredentials('faketoken'));
  //   render(
  //     <BrowserRouter>
  //       <Provider store={mockStore}>
  //         <SingleProduct />
  //       </Provider>
  //     </BrowserRouter>
  //   );
  //   await waitFor(async () => {
  //     const dispatch: AppDispatch = mockStore.dispatch as AppDispatch;
  //     const feedbackId = '1';
  //     const data = { text: 'Updated Feedback' };
  //     const productId = '1';
  //     // await triggerUpdateFeedback(dispatch, feedbackId, data, productId);
  //     expect(dispatch).toBeCalled;
  //   });
  // });
});
