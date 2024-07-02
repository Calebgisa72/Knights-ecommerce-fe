import { describe, it, expect, vi, afterEach, Mocked } from 'vitest';
import axios from 'axios';
import { verifyUser } from '../../../redux/actions/verifyingEmailAction';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { VerifyEmailResponse } from '../../../types/verifyEmailType';

vi.mock('axios');
const mockAxios = axios as Mocked<typeof axios>;

const createTestStore = (extraReducers: any) => {
  const slice = createSlice({
    name: 'verifyEmail',
    initialState: {
      verify: null,
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

// Tests
describe('verifyUser async thunk', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockToken = 'mock-token';

  it('dispatches the correct actions on successful email verification', async () => {
    const mockResponse: VerifyEmailResponse = { message: 'Email verified successfully' };
    mockAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const store = createTestStore((builder: any) => {
      builder
        .addCase(verifyUser.pending, (state: any) => {
          state.loading = true;
        })
        .addCase(verifyUser.fulfilled, (state: any, action: any) => {
          state.loading = false;
          state.verify = action.payload;
        })
        .addCase(verifyUser.rejected, (state: any, action: any) => {
          state.loading = false;
          state.error = action.payload.error;
        });
    });

    const dispatch = store.dispatch as ThunkDispatch<any, void, AnyAction>;
    await dispatch(verifyUser(mockToken));

    const state = store.getState();

    expect(mockAxios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_APP_API_URL}/user/verify/${mockToken}`);
    expect(state.loading).toBe(false);
    expect(state.verify).toEqual(mockResponse);
    expect(state.error).toBeNull();
  });

  it('dispatches the correct actions on verification failure', async () => {
    const mockError = {
      response: {
        data: {
          error: 'Invalid or expired token'
        }
      }
    };
    mockAxios.get.mockRejectedValueOnce(mockError);

    const store = createTestStore((builder: any) => {
      builder
        .addCase(verifyUser.pending, (state: any) => {
          state.loading = true;
        })
        .addCase(verifyUser.fulfilled, (state: any, action: any) => {
          state.loading = false;
          state.verify = action.payload;
        })
        .addCase(verifyUser.rejected, (state: any, action: any) => {
          state.loading = false;
          state.error = action.payload.error;
        });
    });

    const dispatch = store.dispatch as ThunkDispatch<any, void, AnyAction>;
    await dispatch(verifyUser(mockToken));

    const state = store.getState();

    expect(mockAxios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_APP_API_URL}/user/verify/${mockToken}`);
    expect(state.loading).toBe(false);
    expect(state.verify).toBeNull();
    expect(state.error).toBe('Invalid or expired token');
  });
});
