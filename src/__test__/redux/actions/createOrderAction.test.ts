import axios from 'axios';
import store from '../../../redux/store';
import { createOrder } from '../../../redux/actions/createOrderAction';
import { AddressData } from '../../../components/Order/CreateOrder';
import { waitFor } from '@testing-library/dom';
import { resetCreateOrderState } from '../../../redux/reducers/createOrderReducer';

const mockData: AddressData = { country: 'sampleCountry', street: '123 Main St', city: 'AnyTown' };

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('createOrder thunk', () => {
  afterEach(() => {
    vi.clearAllMocks();
    store.dispatch(resetCreateOrderState());
  });

  it('should dispatch fulfilled action and return order data on success', async () => {
    mockedAxios.post.mockResolvedValue({ data: { data: { cartId: '123' } } });
    await waitFor(() => {
      store.dispatch(createOrder(mockData));
      expect(store.getState().createOrder.cartId).toBe('123');
    });
  });
  it('should not set state to new value', async () => {
    mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Something went wrong' } } });
    await waitFor(() => {
      store.dispatch(createOrder(mockData));
    });
  });
});
