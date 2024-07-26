import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, vi, afterEach } from 'vitest';
import axios from 'axios';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../../redux/store';
import Transactions from '../../pages/Transactions/Transctions';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockData = {
  statistics: {
    totalAmount: 5000,
    averagePaymentAmount: 1000,
    totalCapturedAmount: 4000,
    totalPayments: 5,
    successfulPayments: 4,
    pendingPayments: 1
  },
  payments: [
    {
      id: 'pay_1',
      amount: 1000,
      created: 1628353200,
      status: 'succeeded',
      payment_method_types: ['card']
    },
    {
      id: 'pay_2',
      amount: 1200,
      created: 12628353200,
      status: 'pending',
      payment_method_types: ['card']
    }
  ]
};

const emptyPaymentsData = {
  statistics: {
    totalAmount: 0,
    averagePaymentAmount: 0,
    totalCapturedAmount: 0,
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0
  },
  payments: []
};

describe('Transactions Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders Transactions component without crashing', async () => {
    localStorage.setItem('userToken', JSON.stringify({ token: 'mocked-token' }));
    mockedAxios.get.mockResolvedValue({ data: mockData });

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Transactions />
          </MemoryRouter>
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('transactions')).toBeInTheDocument();
    });

    expect(screen.getByTestId('totalVendors')).toBeInTheDocument();
    expect(screen.getByTestId('totalVendors')).toHaveTextContent('5,000 Rwf');
  });
  it('displays No Transactions Found when payments array is empty', async () => {
    localStorage.setItem('userToken', JSON.stringify({ token: 'mocked-token' }));
    mockedAxios.get.mockResolvedValue({ data: emptyPaymentsData });

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Transactions />
          </MemoryRouter>
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('No Transactions Found')).toBeInTheDocument();
    });
  });

  it('displays "No data available" when no data is fetched', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Transactions />
          </MemoryRouter>
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  //   it('displays "No Transactions Found" when payments array is empty', async () => {
  //     localStorage.setItem('userToken', JSON.stringify({ token: 'mocked-token' }));
  //     mockedAxios.get.mockResolvedValue({ data: mockData });

  //     await act(async () => {
  //       render(
  //         <Provider store={store}>
  //           <MemoryRouter>
  //             <Transactions />
  //           </MemoryRouter>
  //         </Provider>
  //       );
  //     });

  //     await waitFor(() => {
  //       expect(screen.getByTestId('transactions')).toBeInTheDocument();
  //     });

  //     expect(screen.getByTestId('totalVendors')).toBeInTheDocument();
  //     expect(screen.getByTestId('totalVendors')).toHaveTextContent('5,000 Rwf');
  //   });

  //   it('displays "No Transactions Found" when payments array is empty', async () => {
  //     localStorage.setItem('userToken', JSON.stringify({ token: 'mocked-token' }));
  //     // mockedAxios.get.mockResolvedValue({ data: emptyPaymentsData });
  //     mockedAxios.get.mockResolvedValue({ data: mockData });
  //     await act(async () => {
  //       render(
  //         <Provider store={store}>
  //           <MemoryRouter>
  //             <Transactions />
  //           </MemoryRouter>
  //         </Provider>
  //       );
  //     });

  //     await waitFor(() => {
  //       expect(screen.getByText('No Transactions Found')).toBeInTheDocument();
  //     });
  //   });

  it('handles missing token correctly', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Transactions />
          </MemoryRouter>
        </Provider>
      );
    });

    expect(consoleSpy).toHaveBeenCalledWith('Token not found');
    expect(screen.getByText('No data available')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
