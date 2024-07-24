import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SingleBuyerOrder from '../../../pages/Orders/SingleBuyerOrder';
import store from '../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import { Order } from '../../../redux/reducers/buyerOrdersReducer';

const sampleOrder: Order | any = {
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
  updatedAt: '2024-07-07T10:31:41.977Z'
};

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Single buyer order test', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
  });
  afterEach(async () => {
    vi.restoreAllMocks();
    mockedAxios.get.mockClear();
    mockedAxios.put.mockClear();
  });

  it('renders SingleBuyerOrder component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleBuyerOrder />
        </MemoryRouter>
      </Provider>
    );
  });

  it('renders Loader component while loading', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleBuyerOrder />
        </MemoryRouter>
      </Provider>
    );
    const loaderElement = screen.getByText('Fetching Order Details, Please wait!', {
      exact: false
    });
    expect(loaderElement).toBeInTheDocument();
  });

  it('renders order data correctly', async () => {
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
      const productElement = screen.getByText('Stew');
      expect(productElement).toBeInTheDocument();
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

  it('updates order status correctly', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          order: sampleOrder
        }
      }
    });

    mockedAxios.put.mockResolvedValue({
      data: {
        data: {
          order: { ...sampleOrder, orderStatus: 'returned' }
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
      const productElement = screen.getByText('Stew');
      expect(productElement).toBeInTheDocument();
    });

    // Find and click the dropdown trigger element
    const statusTrigger = screen.getByTitle(/awaiting shipment/i);
    fireEvent.click(statusTrigger);

    // Wait for the dropdown menu to be displayed
    await waitFor(() => {
      const statusOption = screen.getByText(/returned/i);
      expect(statusOption).toBeInTheDocument();
    });

    // Select the new status
    const newStatusOption = screen.getByText(/returned/i);
    fireEvent.click(newStatusOption);

    // Click the update button
    const updateButton = screen.getByText('UPDATE');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${import.meta.env.VITE_APP_API_URL}/product/client/orders/undefined`,
        { orderStatus: 'returned' },
        {
          headers: {
            Authorization: `Bearer null`,
            'Content-Type': 'application/json'
          }
        }
      );
    });

    await waitFor(() => {
      const updatedStatus = screen.getByText('returned', { exact: false });
      expect(updatedStatus).toBeInTheDocument();
    });
  });
});
