import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createOrder } from '../actions/createOrderAction';

interface createOrderState {
  createdOrder: boolean;
  cartId: string;
  loading: boolean;
  error: string | null;
}

const initialState: createOrderState = {
  createdOrder: false,
  cartId: '',
  loading: false,
  error: null
};

const createOrderSlice = createSlice({
  name: 'create order',
  initialState,
  reducers: {
    resetCreateOrderState: () => initialState,
    setCreatedOrder: (state, action: PayloadAction<any>) => {
      state.createdOrder = true;
      state.cartId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.createdOrder = true;
        state.cartId = action.payload.data.cartId;
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.message || 'Something went wrong, please try again.';
      });
  }
});

export const { resetCreateOrderState, setCreatedOrder } = createOrderSlice.actions;
export default createOrderSlice.reducer;
