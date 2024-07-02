import { DecodedToken } from '../../types/CouponTypes';

export const testindata = {
  code: 'string',
  discountType: 'percentage',
  discountRate: 0,
  expirationDate: '',
  maxUsageLimit: 0,
  product: 'string'
};
export const expectedOutput: DecodedToken = {
  id: 'string',
  email: 'string',
  userType: 'string',
  iat: 5,
  exp: 8
};
