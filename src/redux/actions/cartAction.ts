import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { AddToCartData } from '../../types/cartTypes';

export const getConfig = () => {
  const tokenString = localStorage.getItem('userToken');
  const token = tokenString ? JSON.parse(tokenString).token : null;

  return {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };
};

// Thunk for fetching the cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const config = getConfig();
  const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/cart`, config);
  return response.data;
});

// Thunk for adding a product to the cart
export const addToCart = createAsyncThunk('cart/addToCart', async (addData: AddToCartData, { rejectWithValue }) => {
  try {
    const config = getConfig();
    const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/cart`, addData, config);

    const cartId = response.data.data.cart.id;
    Cookies.set('cartId', cartId, { expires: 7 });
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});

// Thunk for clearing the cart
export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  const config = getConfig();
  const response = await axios.delete(`${import.meta.env.VITE_APP_API_URL}/cart`, config);
  return response.data;
});

// Thunk for removing an item from the cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (id: string) => {
  const config = getConfig();
  const response = await axios.delete(`${import.meta.env.VITE_APP_API_URL}/cart/${id}`, config);
  return response.data;
});
