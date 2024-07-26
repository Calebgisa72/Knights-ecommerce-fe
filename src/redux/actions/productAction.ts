import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Dispatch } from 'redux';
import { ProductActionTypes, ProductActions, ResetProductStateAction } from '../types/productTypes';
import { Product, VendorProduct } from '../../types/productTypes';
import HttpRequest from '../../services/HttpRequest';
import { CreateCouponArgs, getCouponArgs, updateCouponArgs } from '../../types/CouponTypes';
import { AddFeedbackArgs } from '../../types/FeedbackTypes';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/product/all`);
  return response.data;
});
export const createProduct = (formData: FormData) => async (dispatch: Dispatch<ProductActions>) => {
  try {
    dispatch({ type: ProductActionTypes.CREATE_PRODUCT_REQUEST });
    const tokenString = localStorage.getItem('userToken');
    if (!tokenString) {
      throw new Error('Token not found');
    }
    const { token } = JSON.parse(tokenString);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/product/`, formData, config);
    dispatch({
      type: ProductActionTypes.CREATE_PRODUCT_SUCCESS,
      payload: { data: response.data, status: response.status }
    });
  } catch (error: any) {
    dispatch({
      type: ProductActionTypes.CREATE_PRODUCT_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    });
  }
};
export const fetchVendorProducts = createAsyncThunk<VendorProduct, void>(
  'vendorProducts/fetchVendorProducts',
  async (_, { rejectWithValue }) => {
    try {
      const tokenString = localStorage.getItem('userToken');
      if (!tokenString) {
        throw new Error('Token not found');
      }
      const { token } = JSON.parse(tokenString);
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/product/collection?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchSingleProduct = createAsyncThunk<Product, string>(
  'products/fetchSingleProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/product/${productId}`, {});
      return response.data.product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteProduct = createAsyncThunk<string, string>(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const tokenString = localStorage.getItem('userToken');
      if (!tokenString) {
        throw new Error('Token not found');
      }
      const { token } = JSON.parse(tokenString);
      await axios.delete(`${import.meta.env.VITE_APP_API_URL}/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const resetProductState = (): ResetProductStateAction => ({
  type: ProductActionTypes.RESET_PRODUCT_STATE
});

export const createCoupon = createAsyncThunk<any, CreateCouponArgs>(
  'products/createCoupon',
  async ({ data, vendorid }: CreateCouponArgs) => {
    const response = await HttpRequest.post(`${import.meta.env.VITE_APP_API_URL}/coupons/vendor/${vendorid}`, data);
    return response.data;
  }
);
export const getCoupon = createAsyncThunk<any, getCouponArgs>(
  'products/getCoupon',
  async ({ vendorId }: getCouponArgs) => {
    const response = await HttpRequest.get(
      `${import.meta.env.VITE_APP_API_URL}/coupons/vendor/${vendorId}/access-coupons`
    );
    return response.data;
  }
);
export const deleteCoupon = createAsyncThunk<any, getCouponArgs>(
  'products/deleteCoupon',
  async ({ vendorId }: getCouponArgs) => {
    const response = await HttpRequest.delete(
      `${import.meta.env.VITE_APP_API_URL}/coupons/vendor/${vendorId}/checkout/delete`
    );
    return response.data;
  }
);
export const updateCoupon = createAsyncThunk<any, updateCouponArgs>(
  'products/updateCoupon',
  async ({ vendorId, code, data }: updateCouponArgs) => {
    const response = await HttpRequest.put(
      `${import.meta.env.VITE_APP_API_URL}/coupons/vendor/${vendorId}/update-coupon/${code}`,
      data
    );
    return response.data;
  }
);
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const tokenString = localStorage.getItem('userToken');
      if (!tokenString) {
        throw new Error('Token not found');
      }
      const { token } = JSON.parse(tokenString);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}/product/${id}`, formData, config);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message
      );
    }
  }
);
export const addFeedback = createAsyncThunk<any, AddFeedbackArgs>(
  'products/addFeedback',
  async ({ productId, data }: AddFeedbackArgs) => {
    try {
      const response = await HttpRequest.post(`${import.meta.env.VITE_APP_API_URL}/feedback/${productId}/new`, data);
      return response.data;
    } catch (error: any) {
      return { type: 'error', data: error };
    }
  }
);
