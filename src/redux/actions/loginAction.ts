import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { LoginData } from '../../types/registerType';

// Thunk for posting a new product
export const loginUser = createAsyncThunk('Login', async (userData: LoginData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/user/login`, userData);
    return response.data;
  } catch (err) {
    // Return a rejected action containing the error message if the request fails
    const error = err as AxiosError;
    console.log(error);
    return rejectWithValue(error.response?.data || 'An error occurred');
  }
});
