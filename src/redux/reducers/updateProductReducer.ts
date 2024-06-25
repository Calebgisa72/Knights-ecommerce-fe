import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateProduct } from '../actions/productAction';
import { Product } from '../../types/productTypes';
interface UpdateProductState {
  loading: boolean;
  product: Product | null;
  error: string | null;
}
const initialState: UpdateProductState = {
  loading: false,
  product: null,
  error: null
};
const updateProductSlice = createSlice({
  name: 'updateProduct',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});
export default updateProductSlice.reducer;
