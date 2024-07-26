import axios from 'axios';
import toast from 'react-hot-toast';
import handleError from '../errorHandler';
import React from 'react';

export const applyCoupon = async (
  userToken: string,
  couponCode: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!couponCode) return toast.error('Enter Coupon code before applying!');
  try {
    setLoading(true);
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/coupons/apply`,
      { couponCode: couponCode },
      {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    );
    if (response.status === 200) {
      toast.success(`${response.data.message} amount reduced ${response.data.amountDiscounted}`);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
};
