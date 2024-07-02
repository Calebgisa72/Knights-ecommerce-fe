// src/utils/test-utils.test.tsx
import React from 'react';
import { cleanup, render, screen } from './test-utils';
import { testindata, expectedOutput } from './testPayload';
import '@testing-library/jest-dom';
import { DecodedToken } from '../../types/CouponTypes';

afterEach(() => {
  cleanup();
});

function TestComponent() {
  return <div>Test Component</div>;
}

describe('customRender and cleanup', () => {
  it('renders a component using custom render', () => {
    render(<TestComponent />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('cleans up after each test', () => {
    expect(document.body.innerHTML).toBe('');
  });
});

describe('Test payload', () => {
  it('should have correct structure for testindata', () => {
    expect(testindata).toEqual({
      code: 'string',
      discountType: 'percentage',
      discountRate: 0,
      expirationDate: '',
      maxUsageLimit: 0,
      product: 'string'
    });
  });

  it('should have correct structure for expectedOutput', () => {
    const expected: DecodedToken = {
      id: 'string',
      email: 'string',
      userType: 'string',
      iat: 5,
      exp: 8
    };
    expect(expectedOutput).toEqual(expected);
  });

  it('should have valid data types for testindata', () => {
    expect(typeof testindata.code).toBe('string');
    expect(typeof testindata.discountType).toBe('string');
    expect(typeof testindata.discountRate).toBe('number');
    expect(typeof testindata.expirationDate).toBe('string');
    expect(typeof testindata.maxUsageLimit).toBe('number');
    expect(typeof testindata.product).toBe('string');
  });

  it('should have valid data types for expectedOutput', () => {
    expect(typeof expectedOutput.id).toBe('string');
    expect(typeof expectedOutput.email).toBe('string');
    expect(typeof expectedOutput.userType).toBe('string');
    expect(typeof expectedOutput.iat).toBe('number');
    expect(typeof expectedOutput.exp).toBe('number');
  });
});
