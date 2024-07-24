import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import axios from 'axios';
import VendorOrder from '../../../pages/Orders/VendorOrder';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const testOrders = [
  {
    id: 'orderId',
    totalPrice: 2000,
    orderStatus: 'completed',
    quantity: '30',
    address: 'Rda, Kgl, KK302st',
    createdAt: '2024-07-05T14:13:57.188Z',
    updatedAt: '2024-07-05T14:13:57.188Z',
    buyer: {
      firstName: 'test-user',
      lastName: 'test-user',
      phoneNumber: '0790',
      gender: 'Female',
      email: 'test-user@test.com'
    },
    vendorOrderItems: [{}]
  },
  {
    id: 'orderId',
    totalPrice: 2000,
    orderStatus: 'cancelled',
    quantity: '30',
    address: 'Rda, Kgl, KK302st',
    createdAt: '2024-07-05T14:13:57.188Z',
    updatedAt: '2024-07-05T14:13:57.188Z',
    buyer: {
      firstName: 'test-user',
      lastName: 'test-user',
      phoneNumber: '0790',
      gender: 'Female',
      email: 'test-user@test.com'
    },
    vendorOrderItems: [{}]
  },
  {
    id: 'orderId',
    totalPrice: 2000,
    orderStatus: 'pending',
    quantity: '30',
    address: 'Rda, Kgl, KK302st',
    createdAt: '2024-07-05T14:13:57.188Z',
    updatedAt: '2024-07-05T14:13:57.188Z',
    buyer: {
      firstName: 'test-user',
      lastName: 'test-user',
      phoneNumber: '0790',
      gender: 'Female',
      email: 'test-user@test.com'
    },
    vendorOrderItems: [{}]
  },
  {
    id: 'orderId',
    totalPrice: 2000,
    orderStatus: 'is-accepted',
    quantity: '30',
    address: 'Rda, Kgl, KK302st',
    createdAt: '2024-07-05T14:13:57.188Z',
    updatedAt: '2024-07-05T14:13:57.188Z',
    buyer: {
      firstName: 'test-user',
      lastName: 'test-user',
      phoneNumber: '0790',
      gender: 'Female',
      email: 'test-user@test.com'
    },
    vendorOrderItems: [{}]
  }
];
describe('VendorOrders component tests', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders VendorOrders component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <VendorOrder />
        </MemoryRouter>
      </Provider>
    );
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const headingElement = screen.getByText('All orders', { exact: false });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders retrieved all Orders selected to a vendor', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          orders: testOrders
        }
      }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <VendorOrder />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const rowElements = screen.getAllByRole('row');
      expect(rowElements.length).toBe(5);
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
          <VendorOrder />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const noOrdersElements = screen.getByText('Currently, no orders are in the system!');
      expect(noOrdersElements).toBeInTheDocument();
    });
  });

  it('renders only search order', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          orders: [
            {
              id: 'orderId',
              totalPrice: 2000,
              orderStatus: 'in-transit',
              quantity: '30',
              address: 'Rda, Kgl, KK302st',
              createdAt: '2024-07-05T14:13:57.188Z',
              updatedAt: '2024-07-05T14:13:57.188Z',
              buyer: {
                firstName: 'test-user',
                lastName: 'test-user',
                phoneNumber: '0790',
                gender: 'Female',
                email: 'test-user@test.com'
              },
              vendorOrderItems: [{}]
            }
          ]
        }
      }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <VendorOrder />
        </MemoryRouter>
      </Provider>
    );

    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: 'Rda, Kgl, KK302st' } });
    await waitFor(() => {
      expect(screen.getByText('test-user', { exact: false })).toBeInTheDocument();
    });
  });
  it('should trigger set page function', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          orders: [
            {
              id: 'orderId',
              totalPrice: 2000,
              orderStatus: 'in-transit',
              quantity: '30',
              address: 'Rda, Kgl, KK302st',
              createdAt: '2024-07-05T14:13:57.188Z',
              updatedAt: '2024-07-05T14:13:57.188Z',
              buyer: {
                firstName: 'test-user',
                lastName: 'test-user',
                phoneNumber: '0790',
                gender: 'Female',
                email: 'test-user@test.com'
              },
              vendorOrderItems: [{}]
            }
          ]
        }
      }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <VendorOrder />
        </MemoryRouter>
      </Provider>
    );

    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: 'Rda, Kgl, KK302st' } });
    await waitFor(() => {
      expect(screen.getByText('test-user', { exact: false })).toBeInTheDocument();
    });
  });
});
