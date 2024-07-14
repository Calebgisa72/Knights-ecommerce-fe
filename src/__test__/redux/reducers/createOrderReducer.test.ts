import { createOrder } from '../../../redux/actions/createOrderAction';
import createOrderReducer, { setCreatedOrder } from '../../../redux/reducers/createOrderReducer';
import store from '../../../redux/store';

const initialState = {
  createdOrder: false,
  cartId: '',
  loading: false,
  error: null
};

describe('createOrderSlice', () => {
  it('should have initial state with a possibly expired token', () => {
    const initialState = store.getState().createOrder;
    expect(initialState.createdOrder).toBeFalsy();
  });
  it('should dispatch setCreatedOrder action', () => {
    store.dispatch(setCreatedOrder('test-token'));
    const state = store.getState().createOrder;
    expect(state.cartId).toBeTruthy();
    expect(state.cartId).toBe('test-token');
  });

  it('should handle createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const expectedState = {
      createdOrder: false,
      cartId: '',
      loading: true,
      error: null
    };
    expect(createOrderReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle createOrder.fulfilled', () => {
    const action = { type: createOrder.fulfilled.type, payload: { data: { cartId: '123' } } };
    const expectedState = {
      createdOrder: true,
      cartId: '123',
      loading: false,
      error: null
    };
    expect(createOrderReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle createOrder.rejected', () => {
    const action = { type: createOrder.rejected.type, payload: { message: 'Error' } };
    const expectedState = {
      createdOrder: false,
      cartId: '',
      loading: false,
      error: 'Error'
    };
    expect(createOrderReducer(initialState, action)).toEqual(expectedState);
  });
});
