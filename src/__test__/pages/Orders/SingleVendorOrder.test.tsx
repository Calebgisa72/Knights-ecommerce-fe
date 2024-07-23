import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import store from '../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import { Order } from '../../../redux/reducers/buyerOrdersReducer';
import SingleVendorOrder from '../../../pages/Orders/SingleVendorOrder';

const sampleOrder: Order | any = {
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
  vendorOrderItems: [
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
  ]
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
          <SingleVendorOrder />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('all orders', { exact: false })).toBeInTheDocument();
  });

  it('renders retrieved order data correctly', async () => {
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
          <SingleVendorOrder />
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
          <SingleVendorOrder />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const notFoundElement = screen.getByText(/order not found/i);
      expect(notFoundElement).toBeInTheDocument();
    });
  });

  it('renders Qty/Stock as quantity on small screen', async () => {
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
          <SingleVendorOrder />
        </MemoryRouter>
      </Provider>
    );
    global.innerWidth = 400;
    global.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      const tableHeadElement = screen.getByText('Qty/Stock', { exact: false });
      expect(tableHeadElement).toBeInTheDocument();
    });
  });

  it('render editable form and vendor can update order status correctly', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          order: { ...sampleOrder, orderStatus: 'in-transit' }
        }
      }
    });

    mockedAxios.put.mockResolvedValue({
      data: {
        data: {
          order: { ...sampleOrder, orderStatus: 'delivered' }
        }
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleVendorOrder />
        </MemoryRouter>
      </Provider>
    );
    // Find and click the dropdown trigger element
    const statusTrigger = await waitFor(() => screen.getByTitle(/in-transit/i));
    fireEvent.click(statusTrigger);

    const updateButton = screen.getByText('UPDATE');
    fireEvent.click(updateButton);
  });
});
