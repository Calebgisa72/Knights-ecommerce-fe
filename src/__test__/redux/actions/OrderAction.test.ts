/* eslint-disable */
import axios from 'axios';
import toast from 'react-hot-toast';
import { vi, describe, it } from 'vitest';

// Mock the toast functions

import { GetOrders, UpdateFeedback, deleteFeedback } from '../../../redux/actions/OrdersAction'; // Adjust the path accordingly
import store from '../../../redux/store';
import { resetState } from '../../../redux/reducers/productReducer';
import { setOrders } from '../../../redux/reducers/buyerOrdersReducer';
import HttpRequest from '../../../services/HttpRequest';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Async Thunks buyerOrders', () => {
  beforeAll(() => {
    vi.resetAllMocks();
    store.dispatch(
      setOrders([
        {
          id: '18e55105-4e19-4292-8c09-f47dcf963f76',
          totalPrice: 1350,
          orderStatus: 'completed',
          quantity: '3',
          address: 'Rwanda, Nyamirambo, KN 100 ST',
          createdAt: new Date('2024-07-10T23:25:16.601Z'),
          updatedAt: new Date('2024-07-10T23:26:32.226Z'),
          orderItems: [
            {
              id: '4bdb8d54-8508-45c5-af8a-7035c289cfa2',
              price: 450,
              quantity: 3,
              product: {
                id: '92a3bc17-c3a5-42e0-a543-7635feb326de',
                name: 'Sumsung',
                price: '450'
              }
            }
          ],
          cartId: '90a3bc17-c3a5-42e0-a543-7635feb326de'
        }
      ])
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  beforeEach(() => {
    store.dispatch(resetState());
  });
  describe('GetOrders', () => {
    it('dispatches fulfilled action when GetOrders is successful', async () => {
      const mockResponse = { data: ['order1', 'order2'] };

      mockedAxios.post.mockResolvedValueOnce({ data: 'responseData' });
      await store.dispatch(GetOrders());
    });

    it('dispatches rejected action when GetOrders fails', async () => {
      const mockError = { response: { data: 'Error' } };
      mockedAxios.get.mockRejectedValue(mockError);

      await store.dispatch(GetOrders());
    });
  });

  describe('UpdateFeedback', () => {
    it('dispatches fulfilled action and shows success toast when UpdateFeedback is successful', async () => {
      const mockResponse = { data: { message: 'Feedback updated successfully' } };
      mockedAxios.put.mockResolvedValue(mockResponse);

      const feedbackArgs = { feedbackId: '1', data: {} };
      await store.dispatch(UpdateFeedback(feedbackArgs));
    });

    it('dispatches rejected action when UpdateFeedback fails', async () => {
      const mockError = { response: { data: 'Error' } };
      mockedAxios.put.mockRejectedValue(mockError);

      const feedbackArgs = { feedbackId: '1', data: {} };

      await store.dispatch(UpdateFeedback(feedbackArgs));
    });
  });

  describe('deleteFeedback', () => {
    it('dispatches fulfilled action and shows success toast when deleteFeedback is successful', async () => {
      const mockResponse = { data: { message: 'Feedback deleted successfully' } };
      mockedAxios.delete.mockResolvedValue(mockResponse);
      const feedbackArgs = { feedbackId: '1' };
      await store.dispatch(deleteFeedback(feedbackArgs));
    });

    it('dispatches rejected action when deleteFeedback fails', async () => {
      const mockError = { response: { data: 'Error' } };
      mockedAxios.delete.mockRejectedValue(mockError);

      const feedbackArgs = { feedbackId: '1' };

      await store.dispatch(deleteFeedback(feedbackArgs));
    });
  });
});
