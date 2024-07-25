import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import AdminOrders from '../../../pages/Orders/AdminOrders';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AdminOrders component tests', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders AdminOrders component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AdminOrders />
        </MemoryRouter>
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Search by Buyer, Address');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders retrieved admin Orders', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          orders: [
            {
              id: 'orderId1',
              buyer: { firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890' },
              totalPrice: 2000,
              orderStatus: 'completed',
              quantity: 30,
              address: 'Rda, Kgl, KK302st',
              createdAt: '2024-07-05T14:13:57.188Z',
              updatedAt: '2024-07-05T14:13:57.188Z'
            },
            {
              id: 'orderId2',
              buyer: { firstName: 'Jane', lastName: 'Smith', phoneNumber: '0987654321' },
              totalPrice: 1500,
              orderStatus: 'pending',
              quantity: 20,
              address: 'Rda, Kgl, KK301st',
              createdAt: '2024-07-06T14:13:57.188Z',
              updatedAt: '2024-07-06T14:13:57.188Z'
            }
          ]
        }
      }
    });
  });

  it('renders text for no orders in system, if a there no orders in system', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          orders: []
        }
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <AdminOrders />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const noOrdersElements = screen.getByText('Currently, no orders are in the system!');
      expect(noOrdersElements).toBeInTheDocument();
    });
  });

  it('updates pagination on page change', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          orders: Array.from({ length: 10 }, (_, i) => ({
            id: `orderId${i}`,
            buyer: { firstName: `First${i}`, lastName: `Last${i}`, phoneNumber: `123456789${i}` },
            totalPrice: 1000 + i * 100,
            orderStatus: i % 2 === 0 ? 'completed' : 'pending',
            quantity: 10 + i,
            address: `Address${i}, City${i}, State${i}`,
            createdAt: '2024-07-05T14:13:57.188Z',
            updatedAt: '2024-07-05T14:13:57.188Z'
          }))
        }
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <AdminOrders />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const rowElements = screen.getAllByRole('row');
      expect(rowElements.length).toBe(7); // One header row + six order rows
    });

    const paginationButton = screen.getByRole('button', { name: 'Go to page 2' });
    fireEvent.click(paginationButton);

    await waitFor(() => {
      const rowElements = screen.getAllByRole('row');
      expect(rowElements.length).toBe(5); // One header row + four order rows for the second page
    });
  });

  it('filters orders based on search input', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          orders: [
            {
              id: 'orderId1',
              buyer: { firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890' },
              totalPrice: 2000,
              orderStatus: 'returned',
              quantity: 30,
              address: 'Rda, Kgl, KK302st',
              createdAt: '2024-07-05T14:13:57.188Z',
              updatedAt: '2024-07-05T14:13:57.188Z'
            },
            {
              id: 'orderId2',
              buyer: { firstName: 'Jane', lastName: 'Smith', phoneNumber: '0987654321' },
              totalPrice: 1500,
              orderStatus: 'cancelled',
              quantity: 20,
              address: 'Rda, Kgl, KK301st',
              createdAt: '2024-07-06T14:13:57.188Z',
              updatedAt: '2024-07-06T14:13:57.188Z'
            }
          ]
        }
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <AdminOrders />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const rowElements = screen.getAllByRole('row');
      expect(rowElements.length).toBe(3); // One header row + two order rows
    });

    const searchInput = screen.getByPlaceholderText('Search by Buyer, Address');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    await waitFor(() => {
      const menuElements = screen.getAllByTestId('menuAction');
      fireEvent.click(menuElements[0]);
    });
  });
  it('opens quick action menu', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          orders: [
            {
              id: 'orderId1',
              buyer: { firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890' },
              totalPrice: 2000,
              orderStatus: 'Completed',
              quantity: 30,
              address: 'Rda, Kgl, KK302st',
              createdAt: '2024-07-05T14:13:57.188Z',
              updatedAt: '2024-07-05T14:13:57.188Z'
            },
            {
              id: 'orderId2',
              buyer: { firstName: 'Jane', lastName: 'Smith', phoneNumber: '0987654321' },
              totalPrice: 1500,
              orderStatus: 'cancelled',
              quantity: 20,
              address: 'Rda, Kgl, KK301st',
              createdAt: '2024-07-06T14:13:57.188Z',
              updatedAt: '2024-07-06T14:13:57.188Z'
            }
          ]
        }
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <AdminOrders />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const menuElements = screen.getAllByTestId('menuAction');
      fireEvent.click(menuElements[0]);
    });
  });
});
