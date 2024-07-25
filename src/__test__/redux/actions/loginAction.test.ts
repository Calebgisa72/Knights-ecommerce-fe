import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser } from '../../../redux/actions/loginAction';
import axios from 'axios';

vi.mock('axios');

describe('loginUser async action', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches fulfilled action with login data on successful login', async () => {
    const mockResponse: any = {
      userId: '123',
      token: 'abc123',
      status: 'success'
    };

    mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const dispatch = vi.fn();
    const thunk = loginUser({ email: 'testuser@gmail.com', password: 'password' });

    await thunk(dispatch, vi.fn(), undefined);

    const actions = dispatch.mock.calls.map(([arg]) => arg);

    expect(actions[0].type).toBe(loginUser.pending.type);
    expect(actions[1].type).toBe(loginUser.fulfilled.type);
    expect(actions[1].payload).toEqual(mockResponse);
  });

  it('dispatches rejected action with error message on failed login', async () => {
    const mockError = {
      response: {
        data: 'Invalid credentials'
      }
    };

    mockAxios.post.mockRejectedValueOnce(mockError);

    const dispatch = vi.fn();
    const thunk = loginUser({ email: 'testuser@gmail.com', password: 'wrongpassword' });

    await thunk(dispatch, vi.fn(), undefined);

    const actions = dispatch.mock.calls.map(([arg]) => arg);

    expect(actions[0].type).toBe(loginUser.pending.type);
    expect(actions[1].type).toBe(loginUser.rejected.type);
    expect(actions[1].payload).toBe('Invalid credentials');
  });

  it('dispatches rejected action with default error message when no response data', async () => {
    const mockError = new Error('Network Error');

    mockAxios.post.mockRejectedValueOnce(mockError);

    const dispatch = vi.fn();
    const thunk = loginUser({ email: 'testuser@gmail.com', password: 'password' });

    await thunk(dispatch, vi.fn(), undefined);

    const actions = dispatch.mock.calls.map(([arg]) => arg);

    expect(actions[0].type).toBe(loginUser.pending.type);
    expect(actions[1].type).toBe(loginUser.rejected.type);
    expect(actions[1].payload).toBe('An error occurred');
  });
});
