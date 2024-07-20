import { it, expect, describe } from 'vitest';
import axios from 'axios';
import handleError from '../../../utils/errorHandler';
import toast from 'react-hot-toast';
import { deleteNotifications } from '../../../utils/notificationsFunctios/deleteNotifications';

vi.mock('axios');
vi.mock('../../../utils/errorHandler');
vi.mock('react-hot-toast');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Activating a user', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const userToken = 'mockToken';
  const selectedIds = ['id1', 'id2', 'id3'];

  const mockedResponse = {
    status: 200,
    data: {
      data: {
        message: '3 of 3 Notifications deleted'
      }
    }
  };

  it('should toast a success message when the user is deaactivated', async () => {
    mockedAxios.delete.mockResolvedValueOnce(mockedResponse);

    await deleteNotifications(userToken, selectedIds);

    expect(toast.success).toHaveBeenCalledWith(`3 notifications cleared successfully`);
  });

  it('handles errors correctly', async () => {
    const mockError = new Error('Network Error');
    mockedAxios.delete.mockRejectedValueOnce(mockError);

    await deleteNotifications(userToken, selectedIds);

    expect(handleError).toHaveBeenCalledWith(mockError);
    expect(toast.success).not.toHaveBeenCalled();
  });
});
