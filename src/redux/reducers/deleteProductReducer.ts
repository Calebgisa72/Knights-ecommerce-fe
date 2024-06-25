import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteProduct } from '../actions/productAction';
import { Product } from '../../types/productTypes';
interface ProductState {
  loading: boolean;
  products: Product[];
  product: Product | null;
  vendorProducts: Product[] | null;
  error: string | null;
}
const initialState: ProductState = {
  loading: false,
  products: [],
  product: null,
  vendorProducts: null,
  error: null
};
const productDelete = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.products = state.products.filter((product) => product.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete the product';
      });
  }
});
export default productDelete.reducer;
