import { combineReducers } from '@reduxjs/toolkit';
import productReducer from './productReducer';
import registerReducer from './registerReducer';
import verifyEmailReducer from './verifyEmailReducer';
import userReducer from './userReducer';
import loginReducer from './loginReducer';
import authReducer from './authReducer';
import passwordReducer from './passwordResetReducer';
import { productCreateReducer } from './createProductReducer';
import getSingleProductReducer from './getSingleProductReducer';
import productSliceReducer from './getVendorProductsReducer';
import categoryReducer from './categoryReducer';
import bannerReducer from './bannerReducer';
import searchReducer from '../reducers/SearchReducer';
import cartReducer from './cartReducer';
import updateProductReducer from './updateProductReducer';
import productDelete from './deleteProductReducer';
import wishlistReducer from './wishlistReducer';
import buyerOrdersReducer from './buyerOrdersReducer';
import chatMessageReducer from './chatMessagesReducer';
import createOrderReducer from './createOrderReducer';
import profileReducer from './profileReducer';
import notificationReducer from './notification';

const rootReducer = combineReducers({
  auth: authReducer,
  currentUser: userReducer,
  register: registerReducer,
  login: loginReducer,
  verifyEmail: verifyEmailReducer,
  products: productReducer,
  productCreate: productCreateReducer,
  getVendorProduct: productSliceReducer,
  singleProduct: getSingleProductReducer,
  password: passwordReducer,
  category: categoryReducer,
  banner: bannerReducer,
  search: searchReducer,
  cart: cartReducer,
  updateProduct: updateProductReducer,
  delete: productDelete,
  wishlist: wishlistReducer,
  createOrder: createOrderReducer,
  buyerOrders: buyerOrdersReducer,
  chat: chatMessageReducer,
  profile: profileReducer,
  notification: notificationReducer
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
