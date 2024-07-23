import { numFormat } from '../../utils/numberFormat';

describe('numberFormat util tests', () => {
  test('for numbers above 1000000', () => {
    const result = numFormat(20000000);
    expect(result).toBe('20.0 M');
  });
  test('for numbers above 1000', () => {
    const result = numFormat(2000);
    expect(result).toBe('2.0 K');
  });
  test('for numbers above 1000 with decimals', () => {
    const result = numFormat(2237);
    expect(result).toBe('2.3 K');
  });
  test('for numbers below 1000', () => {
    const result = numFormat(200);
    expect(result).toBe('200');
  });
  test('for numbers below 10', () => {
    const result = numFormat(2);
    expect(result).toBe('02');
  });
});
