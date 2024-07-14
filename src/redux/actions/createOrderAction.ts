import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { AddressData } from '../../components/Order/CreateOrder';
import { RootState } from '../store';

export const createOrder = createAsyncThunk('orders/', async (data: AddressData, { rejectWithValue, getState }) => {
  const state = getState() as RootState;
  const userToken = state.auth.userToken;
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/product/orders`,
      { address: { ...data } },
      {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    );
    return response.data;
  } catch (err) {
    // Return a rejected action containing the error message if the request fails
    const error = err as AxiosError;
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});
