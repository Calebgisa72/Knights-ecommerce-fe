import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { BrowserRouter } from 'react-router-dom';
import { describe, it } from 'vitest';
import axios from 'axios';
import Cart from '../../../components/Cart/Cart';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedCartResponse = {
  code: 200,
  message: 'Cart fetched successfully',
  cart: {
    totalAmount: 0,
    isCheckedOut: false,
    id: '1',
    createdAt: '2022-02-22T13:00:00.000Z',
    updatedAt: '2022-02-22T13:00:00.000Z',
    items: [
      {
        id: '1',
        newPrice: '100',
        quantity: 10,
        total: '1000',
        createdAt: '2021-09-06T14:00:00.000Z',
        updatedAt: '2021-09-06T14:00:00.000Z',
        product: {
          id: '1',
          name: 'Product 1',
          description: 'Product 1 description',
          images: ['product1.jpg'],
          newPrice: '100',
          oldPrice: null,
          expirationDate: '2022-09-06T14:00:00.000Z',
          quantity: 100,
          isAvailable: true,
          createdAt: '2021-09-06T14:00:00.000Z',
          updatedAt: '2021-09-06T14:00:00.000Z'
        }
      }
    ]
  }
};

const mockedCartResponse1 = {
  code: 200,
  message: 'Cart is empty',
  cart: []
};

describe('Cart test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: {
        data: mockedCartResponse1
      }
    });
  });

  it('renders the Cart Page with no item', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const h1Element = screen.getByText('Shopping Cart', { selector: 'h1' });
      expect(h1Element).toBeInTheDocument();

      const pElement = screen.getByText('No item in cart at the moment', { selector: 'p' });
      expect(pElement).toBeInTheDocument();
    });
  });

  it('renders the Cart Page content', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: mockedCartResponse
      }
    });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const pElement1 = screen.getByText('Products', { selector: 'p' });
      expect(pElement1).toBeInTheDocument();

      const pElement2 = screen.getByText('Title', { selector: 'p' });
      expect(pElement2).toBeInTheDocument();

      const pElement3 = screen.getByText('Price', { selector: 'p' });
      expect(pElement3).toBeInTheDocument();

      const pElement4 = screen.getByText('Quantity', { selector: 'p' });
      expect(pElement4).toBeInTheDocument();

      const pElement6 = screen.getByText('Remove', { selector: 'p' });
      expect(pElement6).toBeInTheDocument();

      const productElement = screen.getByText('Product 1');
      expect(productElement).toBeInTheDocument();

      const priceElement = screen.getByText('RWF100');
      expect(priceElement).toBeInTheDocument();

      const quantityElement = screen.getByText('10');
      expect(quantityElement).toBeInTheDocument();

      const totalElement = screen.getByText('RWF1,000');
      expect(totalElement).toBeInTheDocument();

      const h1CouponCode = screen.getByText('Coupon Code', { selector: 'h1' });
      expect(h1CouponCode).toBeInTheDocument();

      const inputElement = screen.getByPlaceholderText('COUPONCODE');
      expect(inputElement).toBeInTheDocument();

      const buttonElement = screen.getByText('Apply Coupon', { selector: 'button' });
      expect(buttonElement).toBeInTheDocument();

      const h1CartTotals = screen.getByText('Cart Totals', { selector: 'h1' });
      expect(h1CartTotals).toBeInTheDocument();

      const subTotalElement = screen.getByText('Subtotals');
      expect(subTotalElement).toBeInTheDocument();

      const deliveryFeeElement = screen.getByText('Delivery Fee');
      expect(deliveryFeeElement).toBeInTheDocument();

      const deliveryTypeElement = screen.getByText('Free');
      expect(deliveryTypeElement).toBeInTheDocument();

      const proceedToCheckoutButton = screen.getByText('PROCEED TO CHECKOUT');
      expect(proceedToCheckoutButton).toBeInTheDocument();

      const tatalP = screen.getAllByText('Total', { selector: 'p' });
      expect(tatalP).toHaveLength(2);
    });
  });
});
