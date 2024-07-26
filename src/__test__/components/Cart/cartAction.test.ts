import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import rootReducer from '../../../redux/reducers/rootReducer'; // Adjust the path to your rootReducer
import type { AppDispatch } from '../../../redux/store'; // Import types
import Cookies from 'js-cookie';
import { AddToCartData } from '../../../types/cartTypes';
import { addToCart, clearCart, fetchCart, removeFromCart } from '../../../redux/actions/cartAction';

describe('cartActions', () => {
  let mockAxios: MockAdapter;
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
          immutableCheck: false
        })
    });
    localStorage.setItem('userToken', JSON.stringify({ token: 'test-token' }));
  });

  afterEach(() => {
    mockAxios.reset();
    localStorage.clear();
  });

  it('fetchCart should make the correct API call and handle the response', async () => {
    const cartData = { data: { cart: [{ id: 'cart123', totalAmount: 100 }] } };
    mockAxios.onGet(`${import.meta.env.VITE_APP_API_URL}/cart`).reply(200, cartData);

    const result = await (store.dispatch as AppDispatch)(fetchCart());

    expect(result.type).toBe('cart/fetchCart/fulfilled');
    expect(result.payload).toEqual(cartData);
    expect(mockAxios.history.get[0].url).toBe(`${import.meta.env.VITE_APP_API_URL}/cart`);
  });

  it('addToCart should make the correct API call and handle the response', async () => {
    const addData: AddToCartData = { productId: 'prod123', quantity: 1 };
    const responseData = { data: { cart: { id: 'cart123' } } };
    mockAxios.onPost(`${import.meta.env.VITE_APP_API_URL}/cart`).reply(200, responseData);

    const result = await (store.dispatch as AppDispatch)(addToCart(addData));

    expect(result.type).toBe('cart/addToCart/fulfilled');
    expect(result.payload).toEqual(responseData);
    expect(mockAxios.history.post[0].url).toBe(`${import.meta.env.VITE_APP_API_URL}/cart`);
    expect(Cookies.get('cartId')).toBe('cart123');
  });

  it('clearCart should make the correct API call and handle the response', async () => {
    const responseData = { data: { cart: [] } }; // Mock response should match expected structure
    mockAxios.onDelete(`${import.meta.env.VITE_APP_API_URL}/cart`).reply(200, responseData);

    const result = await (store.dispatch as AppDispatch)(clearCart());

    expect(result.type).toBe('cart/clearCart/fulfilled');
    expect(result.payload).toEqual(responseData);
    expect(mockAxios.history.delete[0].url).toBe(`${import.meta.env.VITE_APP_API_URL}/cart`);
  });

  it('removeFromCart should make the correct API call and handle the response', async () => {
    const responseData = { data: { cart: [] } };
    const itemId = 'item123';
    mockAxios.onDelete(`${import.meta.env.VITE_APP_API_URL}/cart/${itemId}`).reply(200, responseData);

    const result = await (store.dispatch as AppDispatch)(removeFromCart(itemId));

    expect(result.type).toBe('cart/removeFromCart/fulfilled');
    expect(result.payload).toEqual(responseData);
    expect(mockAxios.history.delete[0].url).toBe(`${import.meta.env.VITE_APP_API_URL}/cart/${itemId}`);
  });
});
