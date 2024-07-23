import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Buyer } from './vendorOrdersReducer';

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
interface Vendor {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  email: string;
  order: {
    orderStatus: string;
    orderItems: OrderItem[];
  };
}
export interface Order {
  id: string;
  totalPrice: number;
  totalProducts: number;
  orderStatus: string;
  quantity: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  buyer: Buyer;
  vendors: Vendor[];
}

interface InitialState {
  orders: Order[];
}

const initialState: InitialState = {
  orders: []
};

const adminOrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setAdminOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    }
  }
});

export const { setAdminOrders } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
