import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCart, addToCart, clearCart, removeFromCart } from '../actions/cartAction';
import { CartResponse, cartItem, cartData } from '../../types/cartTypes';

export interface cartState {
  cart: cartData | object;
  cartItems: cartItem[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: cartState = {
  cart: {},
  cartItems: [],
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartResponse>) => {
        state.loading = false;
        if (Array.isArray(action.payload.data.cart)) {
          state.cartItems = action.payload.data.cart;
        } else {
          state.cart = action.payload.data.cart!;
          state.cartItems = action.payload.data.cart!.items;
        }
      })
      .addCase(fetchCart.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong, please try again.';
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartResponse>) => {
        state.cart = action.payload.data.cart!;
        state.cartItems = (state.cart as cartData)?.items || [];
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong, please try again.';
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action: PayloadAction<CartResponse>) => {
        state.loading = false;
        if (Array.isArray(action.payload.data.cart)) {
          state.cartItems = action.payload.data.cart;
        } else {
          state.cart = action.payload.data.cart!;
          state.cartItems = action.payload.data.cart!.items;
        }
      })
      .addCase(clearCart.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong, please try again.';
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<CartResponse>) => {
        state.loading = false;
        if (Array.isArray(action.payload.data.cart)) {
          state.cartItems = action.payload.data.cart;
        } else {
          state.cart = action.payload.data.cart!;
          state.cartItems = action.payload.data.cart!.items;
        }
      })
      .addCase(removeFromCart.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong, please try again.';
      });
  }
});

export const { resetState } = cartSlice.actions;
export default cartSlice.reducer;
