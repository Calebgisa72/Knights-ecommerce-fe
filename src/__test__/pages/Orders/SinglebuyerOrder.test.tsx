import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import SingleBuyerOrder from '../../../pages/Orders/SingleBuyerOrder';
import store from '../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import axios from 'axios';

const sampleOrder = {
  address: 'Rwanda, Rwamagana, KK 209st',
  createdAt: '2024-07-05T14:13:57.188Z',
  id: 'ad9865b5-e872-4594-9a11-56eeaac0ccd2',
  orderDate: '2024-07-05T14:13:57.188Z',
  orderItems: [
    {
      id: 'b37b54df-2c47-448f-b72a-7dba8cc85018',
      price: '10',
      product: {
        description: 'product1description',
        expirationDate: null,
        id: 'da82e5a4-c30e-47c8-b359-e600e2b4ec57',
        images: 'https://res.cloudinary.com/dtejb5dwp/image/upload/v1719475815/vtycwuuxmyahsedc4ekr.jpg',
        name: 'Stew',
        price: '10'
      },
      quantity: 1
    }
  ],

  orderStatus: 'awaiting shipment',
  quantity: 2,
  totalPrice: '1010',
  updatedAt: '2024-07-07T10:31:41.977'
};

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Single buyer order test', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
  });
  afterEach(async () => {
    vi.restoreAllMocks();
  });

  it('renders Single buyer component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleBuyerOrder />
        </MemoryRouter>
      </Provider>
    );
  });
  it('renders propagateLoader component while loading', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleBuyerOrder />
        </MemoryRouter>
      </Provider>
    );
    const element = screen.getByTestId('propagateLoader');
    expect(element).toBeInTheDocument();
  });

  it('render retrieve order data', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          order: sampleOrder
        }
      }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleBuyerOrder />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      const tableDataElements = screen.getByText('Stew');
      expect(tableDataElements).toBeInTheDocument();
    });
  });

  it('renders OrderNotFound component if order is not found', async () => {
    mockedAxios.get.mockRejectedValue({ response: { status: 404 } });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleBuyerOrder />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      const notFoundElement = screen.getByText(/order not found/i);
      expect(notFoundElement).toBeInTheDocument();
    });
  });

  it('renders order address correctly', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          order: sampleOrder
        }
      }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleBuyerOrder />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      const addressElement = screen.getByText(/rwanda - rwamagana - kk 209st/i);
      expect(addressElement).toBeInTheDocument();
    });
  });
  it('renders order with cancelled status correctly', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          order: { ...sampleOrder, orderStatus: 'cancelled' }
        }
      }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleBuyerOrder />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      const statusElement = screen.getByText('cancelled', { exact: false });
      expect(statusElement).toBeInTheDocument();
    });
  });
  it('renders order with order placed status correctly', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          order: { ...sampleOrder, orderStatus: 'order placed' }
        }
      }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleBuyerOrder />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      const statusElement = screen.getByText('order placed', { exact: false });
      expect(statusElement).toBeInTheDocument();
    });
  });
  it('renders Qty as quantity on small screen', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          order: { ...sampleOrder }
        }
      }
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleBuyerOrder />
        </MemoryRouter>
      </Provider>
    );
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      const tableHeadElement = screen.getByText('Qty', { exact: false });
      expect(tableHeadElement).toBeInTheDocument();
    });
  });
});
