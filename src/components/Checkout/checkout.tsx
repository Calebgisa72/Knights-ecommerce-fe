import React, { useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import CheckoutForm from './CheckoutForm';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../../redux/actions/cartAction';
import { cartData } from '../../types/cartTypes';

const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const publishableKey = import.meta.env.VITE_APP_API_STRIPE_PUBLISHABLE_KEY;
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const { cart, loading } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    setStripePromise(loadStripe(publishableKey));
  }, [publishableKey]);

  const tokenString = localStorage.getItem('userToken');
  if (!tokenString) {
    throw new Error('Token not found');
  }
  const { token } = JSON.parse(tokenString);

  useEffect(() => {
    if (cart && 'id' in cart && !clientSecret) {
      const createPaymentIntent = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_APP_API_URL}/product/payment/${cart.id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setClientSecret(response.data.clientSecret);
        } catch (error) {
          console.error('Error creating payment intent:', error);
        }
      };
      createPaymentIntent();
    }
  }, [cart, token, clientSecret]);

  if (loading) {
    <p>Loading...</p>;
  }
  return (
    <div className="flex w-full items-center justify-center flex-col">
      <div className="flex gap-4 py-[64px] w-full items-center justify-center" data-testid="stripe-cont">
        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} amount={(cart as cartData).totalAmount} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Checkout;
