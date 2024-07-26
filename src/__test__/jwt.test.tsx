import jwtDecode from 'jwt-decode';
import { DecodedToken } from '../types/CouponTypes';
import { decodedToken } from '../services';

// Mock jwt-decode module
vi.mock('jwt-decode', () => ({
  default: vi.fn()
}));

describe('decodedToken', () => {
  const originalError = console.error;

  beforeAll(() => {
    console.error = vi.fn(); // Mock console.error
  });

  afterAll(() => {
    console.error = originalError; // Restore console.error
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return testData if provided', () => {
    const testData: DecodedToken = {
      id: '123',
      email: 'test@example.com',
      userType: 'admin',
      iat: 1615552560,
      exp: 1615556160
    };
    const result = decodedToken({ testData });
    expect(result).toEqual(testData);
  });

  it('should return null if no token in localStorage', () => {
    const result = decodedToken({});
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('No user token found in localStorage');
  });

  it('should return null if token structure is invalid', () => {
    localStorage.setItem('userToken', JSON.stringify({}));
    const result = decodedToken({});
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Invalid token structure');
  });

  it('should return null if there is an error in decoding token', () => {
    const mockToken = 'mock.jwt.token';
    (jwtDecode as any).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    localStorage.setItem('userToken', JSON.stringify({ token: mockToken }));

    const result = decodedToken({});
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Error decoding token', expect.any(Error));
  });
});
