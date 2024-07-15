import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import CreateOrder from '../../../components/Order/CreateOrder';
import toast from 'react-hot-toast';
import { setCreatedOrder } from '../../../redux/reducers/createOrderReducer';

vi.mock('react-hot-toast');
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('CreateOrder component test', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
  });
  it('renders CreateOrder component', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateOrder />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByText('Add your Address')).not.toBeInTheDocument();
  });
  it('renders form error on form submission', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateOrder />
        </MemoryRouter>
      </Provider>
    );

    const submitButtonElement = screen.getByText('Place Order');
    await waitFor(() => {
      fireEvent.click(submitButtonElement);
      expect(screen.getByText('City is required.', { exact: false })).toBeInTheDocument();
    });
  });
  it('renders form error on form submission, when city is not among predefined cities', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateOrder />
        </MemoryRouter>
      </Provider>
    );
    const newOption = document.createElement('option');
    newOption.value = 'NewCity';
    newOption.text = 'NewCity';

    const citySelectElement = screen.getByLabelText(/city/i);
    citySelectElement.appendChild(newOption);

    fireEvent.change(citySelectElement, { target: { value: 'NewCity' } });
    expect(citySelectElement).toHaveDisplayValue('NewCity');

    const streetInputElement = screen.getByPlaceholderText(/KK 249st | village/i);
    fireEvent.change(streetInputElement, { target: { value: 'KK 249st' } });

    const submitButtonElement = screen.getByText('Place Order');
    fireEvent.click(submitButtonElement);

    await waitFor(() => {
      expect(screen.getByText('Please select one of provided cities.', { exact: false })).toBeInTheDocument();
    });
  });
  it('renders success message when setCreatedOrder is dispatched', async () => {
    store.dispatch(setCreatedOrder('123'));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateOrder />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith('Your order has been created,\n Please proceed with payment!', {
        duration: 4000
      });
    });
  });
});
