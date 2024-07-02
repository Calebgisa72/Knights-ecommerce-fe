import { describe, it, expect, vi, afterEach, Mocked } from 'vitest';
import axios from 'axios';
import { loginUser } from '../../../redux/actions/loginAction';
import { LoginData, LoginResponse } from '../../../types/registerType';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

vi.mock('axios');
const mockAxios = axios as Mocked<typeof axios>;

const mockLoginData: LoginData = {
  email: 'test@example.com',
  password: 'password123'
};

const createTestStore = (extraReducers: any) => {
  const slice = createSlice({
    name: 'login',
    initialState: {
      login: null,
      loading: false,
      error: null
    },
    reducers: {},
    extraReducers
  });

  return configureStore({
    reducer: slice.reducer
  });
};

describe('loginUser async thunk', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches the correct actions on successful login', async () => {
    const mockResponse: LoginResponse = { status: '' };
    mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const store = createTestStore((builder: any) => {
      builder
        .addCase(loginUser.pending, (state: any) => {
          state.loading = true;
        })
        .addCase(loginUser.fulfilled, (state: any, action: any) => {
          state.loading = false;
          state.login = action.payload;
        })
        .addCase(loginUser.rejected, (state: any, action: any) => {
          state.loading = false;
          state.error = action.payload.message;
        });
    });

    const dispatch = store.dispatch as ThunkDispatch<any, void, AnyAction>;
    await dispatch(loginUser(mockLoginData));

    const state = store.getState();

    expect(mockAxios.post).toHaveBeenCalledWith(`${import.meta.env.VITE_APP_API_URL}/user/login`, mockLoginData);
    expect(state.loading).toBe(false);
    expect(state.login).toEqual(mockResponse);
    expect(state.error).toBeNull();
  });

  it('dispatches the correct actions on login failure', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    };
    mockAxios.post.mockRejectedValueOnce(mockError);

    const store = createTestStore((builder: any) => {
      builder
        .addCase(loginUser.pending, (state: any) => {
          state.loading = true;
        })
        .addCase(loginUser.fulfilled, (state: any, action: any) => {
          state.loading = false;
          state.login = action.payload;
        })
        .addCase(loginUser.rejected, (state: any, action: any) => {
          state.loading = false;
          state.error = action.payload.message;
        });
    });

    const dispatch = store.dispatch as ThunkDispatch<any, void, AnyAction>;
    await dispatch(loginUser(mockLoginData));

    const state = store.getState();

    expect(mockAxios.post).toHaveBeenCalledWith(`${import.meta.env.VITE_APP_API_URL}/user/login`, mockLoginData);
    expect(state.loading).toBe(false);
    expect(state.login).toBeNull();
    expect(state.error).toBe('Invalid credentials');
  });
});
