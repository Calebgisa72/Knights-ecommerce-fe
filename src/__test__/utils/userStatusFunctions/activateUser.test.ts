import { it, expect, describe } from 'vitest';
import axios from 'axios';
import handleError from '../../../utils/errorHandler';
import toast from 'react-hot-toast';
import { activateUser } from '../../../utils/updateUserStatus/activateUser';

vi.mock('axios');
vi.mock('../../../utils/errorHandler');
vi.mock('../../../redux/reducers/wishlistReducer');
vi.mock('react-hot-toast');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Activating a user', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const userToken = 'mockToken';
  const email = 'example@gmail.com';
  const name = 'Test user';
  const setReload = vi.fn();
  const setUpadatingLaoding = vi.fn();

  const mockedResponse = {
    status: 200
  };

  it('should toast a success message when the user is activated', async () => {
    mockedAxios.post.mockResolvedValueOnce(mockedResponse);
    vi.useFakeTimers();

    await activateUser(userToken, email, name, setReload, setUpadatingLaoding);

    expect(toast.success).toHaveBeenCalledWith(`${name} activated successfully`);
    expect(setUpadatingLaoding).toHaveBeenCalled();
    vi.runAllTimers();
    expect(setReload).toHaveBeenCalled();
  });

  it('handles errors correctly', async () => {
    const mockError = new Error('Network Error');
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await activateUser(userToken, email, name, setReload, setUpadatingLaoding);

    expect(handleError).toHaveBeenCalledWith(mockError);
    expect(toast.success).not.toHaveBeenCalled();
  });
});
