import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { GetOrders } from '../actions/OrdersAction';

interface Product {
  id: string;
  name: string;
  price: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  product: Product;
  price: number;
}
export interface Order {
  id: string;
  totalPrice: number;
  orderStatus: string;
  quantity: string;
  address: string;
  cartId: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
}

interface InitialState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  orders: [],
  loading: false,
  error: ''
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetOrders.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.orders = action.payload?.orders;
      })
      .addCase(GetOrders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.message || 'Something went wrong, please try again.';
      });
  }
});

export const { setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
