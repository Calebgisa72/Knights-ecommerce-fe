import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { describe, it, beforeAll, afterAll, vi } from 'vitest';
import CheckoutForm from '../../../components/Checkout/CheckoutForm';

vi.mock('@stripe/react-stripe-js', () => ({
  useStripe: vi.fn(),
  useElements: vi.fn(),
  PaymentElement: vi.fn(() => <div>Mocked Payment Element</div>),
  Elements: ({ children }: { children: any }) => <div>{children}</div>
}));

const mockedUseStripe = useStripe as jest.Mock;
const mockedUseElements = useElements as jest.Mock;

describe('CheckoutForm Component', () => {
  beforeAll(() => {
    mockedUseStripe.mockReturnValue({
      confirmPayment: vi.fn().mockResolvedValue({})
    });
    mockedUseElements.mockReturnValue({});
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it('renders the form with the correct elements', () => {
    render(
      <Elements stripe={null}>
        <CheckoutForm clientSecret="test-client-secret" amount={100} />
      </Elements>
    );

    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Order Total')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Payment Details')).toBeInTheDocument();
    expect(screen.getByText('Mocked Payment Element')).toBeInTheDocument();
    expect(screen.getByText('Pay Now')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    const mockConfirmPayment = vi.fn().mockResolvedValue({});
    mockedUseStripe.mockReturnValue({ confirmPayment: mockConfirmPayment });
    mockedUseElements.mockReturnValue({});

    render(
      <Elements stripe={null}>
        <CheckoutForm clientSecret="test-client-secret" amount={100} />
      </Elements>
    );

    const button = screen.getByText('Pay Now');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockConfirmPayment).toHaveBeenCalledTimes(1);
    });
  });
});
