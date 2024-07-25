import { describe, it, expect } from 'vitest';
import loginReducer, { resetState } from '../../../redux/reducers/loginReducer';
import { loginUser } from '../../../redux/actions/loginAction';
import { LoginResponse } from '../../../types/registerType';

interface loginState {
  login: LoginResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: loginState = {
  login: null,
  loading: false,
  error: null
};

describe('loginReducer', () => {
  it('should return the initial state', () => {
    expect(loginReducer(undefined, { type: 'undefined' })).toEqual(initialState);
  });

  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const expectedState = {
      login: null,
      loading: true,
      error: null
    };

    expect(loginReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle loginUser.fulfilled', () => {
    const payload: any = {
      userId: '123',
      token: 'abc123',
      status: 'success'
    };
    const action = { type: loginUser.fulfilled.type, payload };
    const expectedState = {
      login: payload,
      loading: false,
      error: null
    };

    expect(loginReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle loginUser.rejected', () => {
    const errorPayload = { message: 'Login failed' };
    const action = { type: loginUser.rejected.type, payload: errorPayload };
    const expectedState = {
      login: null,
      loading: false,
      error: 'Login failed'
    };

    expect(loginReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle loginUser.rejected with default error message', () => {
    const action = { type: loginUser.rejected.type, payload: {} };
    const expectedState = {
      login: null,
      loading: false,
      error: 'Something went wrong, please try again.'
    };

    expect(loginReducer(initialState, action)).toEqual(expectedState);
  });

  it('should reset the state', () => {
    const modifiedState: any = {
      login: { userId: '123', token: 'abc123', status: 'success' },
      loading: true,
      error: 'Some error'
    };

    expect(loginReducer(modifiedState, resetState())).toEqual(initialState);
  });
});
