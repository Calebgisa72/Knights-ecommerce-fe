import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { UpdateProfileData, UserTwoFactorAuth } from '../../types/profileTypes';

const getConfig = () => {
  const tokenString = localStorage.getItem('userToken');
  const token = tokenString ? JSON.parse(tokenString).token : null;

  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };
};

// Thunk for fetching profile
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  const config = getConfig();
  const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/user/profile`, config);
  return response.data;
});

// Thunk for updating user profile data
export const updateUserProfile = createAsyncThunk(
  'profile/updateProfileData',
  async (profileData: UpdateProfileData, { rejectWithValue }) => {
    try {
      const config = getConfig();
      const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}/user/update`, profileData, config);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Thunk for updating user profile image
export const updateUserProfileImage = createAsyncThunk(
  'profile/updateProfileImage',
  async (profileImageData: FormData, { rejectWithValue }) => {
    try {
      const config = getConfig();
      config.headers['Content-Type'] = 'multipart/form-data';

      const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}/user/profile`, profileImageData, config);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Thunk for enabling two-factor authentication
export const enableTwoFactorAuth = createAsyncThunk(
  'profile/enableTwoFactorAuth',
  async (userData: UserTwoFactorAuth, { rejectWithValue }) => {
    try {
      const config = getConfig();
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/user/enable-2fa`, userData, config);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
// Thunk for disable two-factor authentication
export const disableTwoFactorAuth = createAsyncThunk(
  'profile/disableTwoFactorAuth',
  async (userData: UserTwoFactorAuth, { rejectWithValue }) => {
    try {
      const config = getConfig();
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/user/disable-2fa`, userData, config);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
