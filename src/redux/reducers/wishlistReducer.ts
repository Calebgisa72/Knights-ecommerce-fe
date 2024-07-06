import { createSlice } from '@reduxjs/toolkit';
import { ProductProp } from '../../components/Products/ProductCard/ClientProductCard';

interface wishlistDetails {
  createdAt: Date;
  id: number;
  productId: string;
  updatedAt?: Date;
}

export interface prodInWishlistProps {
  productInfo: ProductProp;
  wishListDetails: wishlistDetails;
}

interface wishlistProps {
  products: prodInWishlistProps[];
  onWihlistPage: boolean;
}

const initialState: wishlistProps = {
  products: [],
  onWihlistPage: false
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.products = action.payload;
    },
    setOnWishlistPage: (state, action) => {
      state.onWihlistPage = action.payload;
    }
  }
});

export const { setWishlist, setOnWishlistPage } = wishlistSlice.actions;
export default wishlistSlice.reducer;
