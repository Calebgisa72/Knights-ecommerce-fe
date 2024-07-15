import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchSingleProduct } from '../actions/productAction';
import { Product, SingleProductState } from '../../types/productTypes';

const initialState: SingleProductState = {
  loading: false,
  product: null,
  error: null
};

const singleProductSlice = createSlice({
  name: 'singleProduct',
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<Product>) => {
      state.product = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      });
  }
});

export const { setProduct } = singleProductSlice.actions;
export default singleProductSlice.reducer;
