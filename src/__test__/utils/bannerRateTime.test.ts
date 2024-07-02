import { describe, it, expect } from 'vitest';
import { FormatPosted, calculateRate } from '../../utils/bannerRateTime';

describe('Time formatting and Rate calculation test', () => {
  describe('Time formating tests', () => {
    it('should return "1 Year ago" when the date is one year ago', () => {
      const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      expect(FormatPosted(oneYearAgo)).toBe('1 Year ago');
    });
    it('should return "1 Month ago" when the date is one month ago', () => {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      expect(FormatPosted(oneMonthAgo)).toBe('1 Month ago');
    });
    it('should return "1 Week ago" when the date is one week ago', () => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      expect(FormatPosted(oneWeekAgo)).toBe('1 Week ago');
    });
    it('should return "2 Weeks ago" when the date is one week ago', () => {
      const oneWeekAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      expect(FormatPosted(oneWeekAgo)).toBe('2 Weeks ago');
    });

    it('should return "1 Day ago" when the date is one day ago', () => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(FormatPosted(oneDayAgo)).toBe('1 Day ago');
    });

    it('should return "2 Days ago" when the date is one day ago', () => {
      const oneDayAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      expect(FormatPosted(oneDayAgo)).toBe('2 Days ago');
    });

    it('should return "1 Hours ago" when the date is one hour ago', () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      expect(FormatPosted(oneHourAgo)).toBe('1 Hours ago');
    });

    it('should return "1 Minute ago" when the date is one minute ago', () => {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      expect(FormatPosted(oneMinuteAgo)).toBe('1 Minute ago');
    });

    it('should return "1 Second ago" when the date is one second ago', () => {
      const oneSecondAgo = new Date(Date.now() - 1000);
      expect(FormatPosted(oneSecondAgo)).toBe('1 Second ago');
    });
  });

  describe('Rate calculation tests', () => {
    it('should return 50 when the old price is double the new price', () => {
      expect(calculateRate('50', '100')).toBe(50);
    });

    it('should return undefined when the old price and new price are the same', () => {
      expect(calculateRate('100', '100')).toBeUndefined();
    });

    it('should return 100 when the new price is zero', () => {
      expect(calculateRate('0', '100')).toBe(100);
    });

    it('should return NaN when the input cannot be converted to a number', () => {
      expect(calculateRate('abc', '100')).toBeUndefined();
    });
  });
});
