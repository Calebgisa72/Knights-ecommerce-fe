import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ChatMessage } from '../../types/chatTypes';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (chatMessage: ChatMessage, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/chat`, chatMessage);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
