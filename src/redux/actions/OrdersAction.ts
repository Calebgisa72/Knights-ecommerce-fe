import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import HttpRequest from '../../services/HttpRequest';
import toast from 'react-hot-toast';

interface FeedbackArgs {
  feedbackId: string;
  data?: any;
}

export const GetOrders = createAsyncThunk('Orders/get', async () => {
  try {
    const response = await HttpRequest.get(`${import.meta.env.VITE_APP_API_URL}/product/client/orders`);
    return response.data;
  } catch (err) {
    // Return a rejected action containing the error message if the request fails
    const error = err as AxiosError;
    console.log(error);
    return error.response?.data || 'An error occurred';
  }
});

export const UpdateFeedback = createAsyncThunk('Feedback/update', async ({ feedbackId, data }: FeedbackArgs) => {
  try {
    const response = await HttpRequest.put(`${import.meta.env.VITE_APP_API_URL}/feedback/update/${feedbackId}`, data);
    toast.success((response.data as { message?: string })?.message || 'Failed to update product.');
    return response.data;
  } catch (err) {
    // Return a rejected action containing the error message if the request fails
    const error = err as AxiosError;
    console.log(error);
    return error.response?.data || 'An error occurred';
  }
});

export const deleteFeedback = createAsyncThunk('Feedbacks/delete', async ({ feedbackId }: FeedbackArgs) => {
  try {
    const response = await HttpRequest.delete(`${import.meta.env.VITE_APP_API_URL}/feedback/delete/${feedbackId}`);
    toast.success((response.data as { message?: string })?.message || 'Failed to update product.');
    return response.data;
  } catch (err) {
    // Return a rejected action containing the error message if the request fails
    const error = err as AxiosError;
    console.log(error);
    return error.response?.data || 'An error occurred';
  }
});
