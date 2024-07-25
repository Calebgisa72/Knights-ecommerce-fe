import { it, expect, describe, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { clearAll } from '../../../utils/wishlistFunctions/clearAll';
import handleError from '../../../utils/errorHandler';
import { setWishlist } from '../../../redux/reducers/wishlistReducer';
import toast from 'react-hot-toast';

vi.mock('axios');
vi.mock('../../../utils/errorHandler');
vi.mock('../../redux/reducers/wishlistReducer');
vi.mock('react-hot-toast');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('clearAll', () => {
  const mockDispatch = vi.fn();
  const userToken = 'mockToken';
  const mockSetLoading = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('successfully clears all products from wishlist', async () => {
    mockedAxios.delete.mockResolvedValueOnce({
      status: 200
    });

    await clearAll(userToken, mockDispatch, mockSetLoading);

    expect(mockDispatch).toHaveBeenCalledWith(setWishlist([]));
    expect(toast.success).toHaveBeenCalledWith('Removed all products from wishlist');
  });

  it('handles errors correctly when failing to clear wishlist', async () => {
    const mockError = new Error('Network Error');
    mockedAxios.delete.mockRejectedValueOnce(mockError);

    await clearAll(userToken, mockDispatch, mockSetLoading);

    expect(handleError).toHaveBeenCalledWith(mockError);
    expect(mockDispatch).not.toHaveBeenCalledWith(setWishlist([]));
    expect(toast.success).not.toHaveBeenCalled();
  });
});
