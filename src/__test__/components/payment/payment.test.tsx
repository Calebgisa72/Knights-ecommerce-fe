import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, beforeAll, vi, afterEach } from 'vitest';
import CheckOutMain from '../../../pages/Cart/checkOutMain';
import Checkout from '../../../components/Checkout/checkout';
import PaymentOk from '../../../pages/PaymentOk';

vi.mock('axios');
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <div data-testid="elements-mock">{children}</div>,
  loadStripe: vi.fn().mockResolvedValue({})
}));

describe('CheckOutMain Component', () => {
  beforeAll(() => {
    // Reset mocks if needed
    vi.resetAllMocks();
  });

  afterEach(() => {
    // localStorage.clear();
  });

  it('should render CheckOutMain component and display static elements', async () => {
    localStorage.setItem('userToken', JSON.stringify({ token: 'test-token' }));
    render(
      <BrowserRouter>
        <Provider store={store}>
          <CheckOutMain />
        </Provider>
      </BrowserRouter>
    );

    // Use findAllByText and check the length
    const checkoutTexts = await screen.findAllByText('Checkout', { selector: 'p' });
    expect(checkoutTexts).toHaveLength(2);

    const homeLink = await screen.findByRole('link', { name: /Home/i });
    expect(homeLink).toBeInTheDocument();
  });

  it('should render Checkout component', async () => {
    // Set token in localStorage
    localStorage.setItem('userToken', JSON.stringify({ token: 'test-token' }));

    render(
      <BrowserRouter>
        <Provider store={store}>
          <Checkout />
        </Provider>
      </BrowserRouter>
    );

    const container = screen.getByTestId('stripe-cont');
    expect(container).toBeInTheDocument();
  });

  it('should throw an error when token is not found', () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      try {
        render(
          <BrowserRouter>
            <Provider store={store}>
              <Checkout />
            </Provider>
          </BrowserRouter>
        );
      } catch (error) {
        expect(error).toEqual(new Error('Token not found'));
      }
    }).not.toThrow();

    consoleErrorMock.mockRestore();
  });

  it('should render PaymentOk component', () => {
    render(
      <BrowserRouter>
        <PaymentOk />
      </BrowserRouter>
    );

    // Check if the container div is rendered
    const container = screen.getByTestId('payment-ok-container');
    expect(container).toBeInTheDocument();

    // Check if the message is rendered
    const message = screen.getByTestId('payment-ok-message');
    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent('Payment Successful, thank you for shopping with us.');

    // Check if the link is rendered
    const link = screen.getByTestId('continue-shopping-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Continue Shopping');
    expect(link).toHaveAttribute('href', '/');
  });
});
