import store from '../../../redux/store';
import axios from 'axios';
import { addToCart, clearCart, fetchCart, removeFromCart } from '../../../redux/actions/cartAction';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Cart Action test', () => {
  beforeEach(() => {
    localStorage.setItem(
      'userToken',
      JSON.stringify({
        token: 'fakeToken',
        expirationTime: Date.now() + 24 * 60 * 60 * 1000
      })
    );
  });
  afterEach(() => {
    localStorage.removeItem('userToken');
  });
  it('should fetch, clear cart and add or remove product to cart', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { data: { cart: ['responseData'] } } });

    await store.dispatch(fetchCart());
    await store.dispatch(clearCart());
    await store.dispatch(removeFromCart('id-6655'));
    await store.dispatch(
      addToCart({
        quantity: 32
      })
    );
  });
});
