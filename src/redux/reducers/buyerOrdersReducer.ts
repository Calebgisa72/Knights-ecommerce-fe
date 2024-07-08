import { PayloadAction, createSlice } from '@reduxjs/toolkit';

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
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
}

interface InitialState {
  orders: Order[];
}

const initialState: InitialState = {
  orders: []
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    }
  }
});

export const { setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
