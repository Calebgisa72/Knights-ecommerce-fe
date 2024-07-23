import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  price: string;
  quantity: string;
}
interface OrderItem {
  id: string;
  quantity: number;
  product: Product;
  'price/unit': number;
}

export interface Buyer {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  email: string;
}
export interface Order {
  id: string;
  totalPrice: number;
  orderStatus: string;
  quantity: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  buyer: Buyer;
  vendorOrderItems: OrderItem[];
}

interface InitialState {
  orders: Order[];
}

const initialState: InitialState = {
  orders: []
};

const vendorOrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setVendorOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    }
  }
});

export const { setVendorOrders } = vendorOrdersSlice.actions;
export default vendorOrdersSlice.reducer;
