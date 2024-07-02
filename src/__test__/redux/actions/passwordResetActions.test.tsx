import { requestPasswordReset, resetPassword } from '../../../redux/actions/passwordResetActions';
import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
import passwordReducer, { resetState } from '../../../redux/reducers/passwordResetReducer';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const store = configureStore({
  reducer: {
    password: passwordReducer
  }
});

describe('Password Reset Actions', () => {
  beforeEach(() => {
    store.dispatch(resetState());
  });

  it('should handle requestPasswordReset success', async () => {
    const responseData = { message: 'Password reset link sent' };
    mockedAxios.post.mockResolvedValueOnce({ data: responseData });

    const result = await store.dispatch(requestPasswordReset('test@example.com'));

    expect(result.payload).toEqual(responseData);

    expect(store.getState().password).toEqual({
      loading: false,
      error: null,
      resetPassword: responseData
    });
  });

  it('should handle requestPasswordReset error', async () => {
    const errorMessage = 'Failed to request password reset';
    mockedAxios.post.mockRejectedValueOnce({ message: errorMessage });

    try {
      await store.dispatch(requestPasswordReset(''));
    } catch (err) {
      expect(store.getState().password).toEqual({
        loading: false,
        error: errorMessage,
        resetPassword: null
      });
    }
  });

  describe('Reset password action', async () => {
    it('should handle resetPassword success', async () => {
      const responseData = { message: 'Password reset successfully' };
      mockedAxios.post.mockResolvedValueOnce({ data: responseData });

      const result = await store.dispatch(
        resetPassword({
          userId: '1234',
          email: 'helloagain@gmail.com',
          newPassword: 'kane',
          confirmPassword: 'kane'
        })
      );

      expect(result.payload).toEqual(responseData);
    });

    it('should handle resetPassword error', async () => {
      const errorMessage = 'Failed to reset password';
      mockedAxios.post.mockRejectedValueOnce({ message: errorMessage });

      try {
        await store.dispatch(
          resetPassword({
            userId: '1234',
            email: '',
            newPassword: '',
            confirmPassword: ''
          })
        );
      } catch (err) {
        expect(store.getState().password).toEqual({
          loading: false,
          error: errorMessage,
          resetPassword: null
        });
      }
    });
  });
});
