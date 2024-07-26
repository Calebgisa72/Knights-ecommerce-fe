import { it, expect, describe, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { applyCoupon } from '../../../utils/couponFunctions/applyCoupon';
import handleError from '../../../utils/errorHandler';
import toast from 'react-hot-toast';

vi.mock('axios');
vi.mock('../../../utils/errorHandler');
vi.mock('react-hot-toast');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Applying coupon on product', () => {
  const userToken = 'mockToken';
  const couponCode = 'testCode';
  const mockSetLoading = vi.fn();

  const mockedResponse = {
    status: 200,
    data: {
      message: 'Coupon applied successfully',
      amountDiscounted: 5000
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('should toast a success message and reload the page when the coupon is successfully applied', async () => {
    mockedAxios.post.mockResolvedValueOnce(mockedResponse);

    const originalReload = window.location.reload;

    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: {
        ...window.location,
        reload: mockReload
      }
    });

    await applyCoupon(userToken, couponCode, mockSetLoading);

    expect(toast.success).toHaveBeenCalledWith(
      `${mockedResponse.data.message} amount reduced ${mockedResponse.data.amountDiscounted}`
    );

    vi.runAllTimers();

    expect(mockReload).toHaveBeenCalled();

    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: originalReload
    });
  });

  it('should throw an error toast when the copuon code is note submited', async () => {
    const userToken = 'mockToken';
    const couponCode = '';
    const mockSetLoading = vi.fn();

    await applyCoupon(userToken, couponCode, mockSetLoading);
    expect(toast.error).toHaveBeenCalledWith('Enter Coupon code before applying!');
  });

  it('should handle errors correctly', async () => {
    const mockError = new Error('Network Error');
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await applyCoupon(userToken, couponCode, mockSetLoading);

    expect(handleError).toHaveBeenCalledWith(mockError);
    expect(toast.success).not.toHaveBeenCalled();
  });
});
