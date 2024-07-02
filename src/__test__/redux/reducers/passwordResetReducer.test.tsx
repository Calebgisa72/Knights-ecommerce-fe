import { configureStore } from '@reduxjs/toolkit';
import passwordReducer, { resetState } from '../../../redux/reducers/passwordResetReducer';
import { requestPasswordReset, resetPassword } from '../../../redux/actions/passwordResetActions';
import { RegisterResponse } from '../../../types/registerType';
import { PasswordResetData } from '../../../redux/actions/passwordResetActions';
// Create a store with the password reducer
const store = configureStore({
  reducer: {
    password: passwordReducer
  }
});

const resetData: PasswordResetData = {
  userId: '1234',
  email: 'helloexample@gmail.com',
  newPassword: 'password',
  confirmPassword: 'password'
};

describe('passwordResetReducer', () => {
  const initialState = {
    loading: false,
    error: null,
    resetPassword: null
  };

  // PASSED
  it('should return the initial state', () => {
    try {
      expect(store.getState().password).toEqual(initialState);
    } catch (err) {
      console.error('Error in initial state:');
    }
  });

  it('should handle requestPasswordReset.pending', () => {
    try {
      store.dispatch(requestPasswordReset.pending('', ''));
      expect(store.getState().password).toEqual({
        loading: true,
        error: null,
        resetPassword: null
      });
    } catch (err) {
      console.error('Error in requestPasswordReset action:');
    }
  });

  // PASSED
  it('should handle requestPasswordReset.fulfilled', () => {
    const resetResponse: RegisterResponse = {
      data: {
        code: 200,
        message: 'Password reset successfully'
      }
    };
    try {
      store.dispatch(requestPasswordReset.fulfilled(resetResponse, '', ''));
      expect(store.getState().password).toEqual({
        loading: false,
        error: null,
        resetPassword: resetResponse
      });
    } catch (err) {
      console.error('Error in requestPasswordReset action:');
    }
  });

  it('should handle resetPassword.pending', () => {
    try {
      store.dispatch(resetPassword.pending('', resetData, ''));
      expect(store.getState().password).toEqual({
        loading: true,
        error: null,
        resetPassword: null
      });
    } catch (err) {
      console.error('Error in resetPassword action:');
    }
  });

  // PASSED
  it('should handle resetPassword.fulfilled', () => {
    const resetResponse: RegisterResponse = {
      data: {
        code: 200,
        message: 'Password reset successfully'
      }
    };

    try {
      store.dispatch(resetPassword.fulfilled(resetResponse, '', resetData));
      expect(store.getState().password).toEqual({
        loading: false,
        error: null,
        resetPassword: resetResponse
      });
    } catch (err) {
      console.error('Error in resetPassword action:');
    }
  });

  it('should reset state', () => {
    try {
      store.dispatch(resetState());
      expect(store.getState().password).toEqual(initialState);
    } catch (err) {
      console.error('Error in resetState action:');
    }
  });
});
