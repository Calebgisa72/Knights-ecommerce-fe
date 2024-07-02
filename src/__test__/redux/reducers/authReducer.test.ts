import store from '../../../redux/store';
import { setCredentials } from '../../../redux/reducers/authReducer';
describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('should have initial state with a possibly expired token', () => {
    const initialState = store.getState().auth;
    expect(initialState.userToken).toBeNull();
  });
  it('should set credentials and store token in localStorage', () => {
    store.dispatch(setCredentials('test-token'));
    const state = store.getState().auth;
    expect(state.userToken).toBe('test-token');
    const storedToken = JSON.parse(localStorage.getItem('userToken')!);
    expect(storedToken.token).toBe('test-token');
    expect(storedToken.expirationTime).toBeGreaterThan(Date.now());
  });
});
