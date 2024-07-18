import store from '../../../redux/store';
import { registerUser } from '../../../redux/actions/registerAction';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Register Action test', () => {
  it('should register new user', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: 'responseData' });

    await store.dispatch(
      registerUser({
        firstName: 'test-name',
        lastName: 'test-name',
        email: 'email',
        phoneNumber: '232423',
        gender: 'male',
        password: 'string',
        userType: 'string'
      })
    );
  });
  it('returns error, should not register new user', async () => {
    mockedAxios.post.mockRejectedValue({ data: 'responseData' });

    await store.dispatch(
      registerUser({
        firstName: 'test-name',
        lastName: 'test-name',
        email: 'email',
        phoneNumber: '232423',
        gender: 'male',
        password: 'string',
        userType: 'string'
      })
    );
  });
});
