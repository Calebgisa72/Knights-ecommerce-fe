// src/utils/test-utils.test.tsx
// import React from 'react';
import { cleanup } from './test-utils';
import '@testing-library/jest-dom';
import formatDateTime from '../../services/FormatDate';

afterEach(() => {
  cleanup();
});

describe('formatDateTime', () => {
  it('should format the date and time correctly in 12-hour format with AM/PM', () => {
    const input = '2024-06-27T13:45:00Z';
    const expectedOutput = 'June 27, 2024 at 1:45 PM';
    expect(formatDateTime(input)).toBe(expectedOutput);
  });

  it('should format the date and time correctly for a different time', () => {
    const input = '2024-06-27T03:15:00Z';
    const expectedOutput = 'June 27, 2024 at 3:15 AM';
    expect(formatDateTime(input)).toBe(expectedOutput);
  });

  it('should handle midnight correctly', () => {
    const input = '2024-06-27T00:00:00Z';
    const expectedOutput = 'June 27, 2024 at 12:00 AM';
    expect(formatDateTime(input)).toBe(expectedOutput);
  });

  it('should handle noon correctly', () => {
    const input = '2024-06-27T12:00:00Z';
    const expectedOutput = 'June 27, 2024 at 12:00 PM';
    expect(formatDateTime(input)).toBe(expectedOutput);
  });

  it('should throw an error for invalid date strings', () => {
    const input = 'invalid-date-string';
    expect(() => formatDateTime(input)).toBeFalsy;
  });
});
