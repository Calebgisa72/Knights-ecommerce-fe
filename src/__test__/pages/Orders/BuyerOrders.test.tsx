import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import BuyerOrders from '../../../pages/Orders/BuyerOrders';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BuyerOrders component tests', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders BuyerOrders component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BuyerOrders />
        </MemoryRouter>
      </Provider>
    );
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    const headingElement = screen.getByText('Order management', { exact: false });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders retrieved buyer Orders', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          orders: [
            {
              id: 'orderId',
              totalPrice: 2000,
              orderStatus: 'Order placed',
              quantity: '30',
              address: 'Rda, Kgl, KK302st',
              createdAt: '2024-07-05T14:13:57.188Z',
              updatedAt: '2024-07-05T14:13:57.188Z'
            }
          ]
        }
      }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BuyerOrders />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const rowElements = screen.getAllByRole('row');
      expect(rowElements.length).toBe(2);
    });
  });
});
