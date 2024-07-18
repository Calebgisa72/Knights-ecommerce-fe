import { it, expect, describe } from 'vitest';
import formatDateAndTime from '../../utils/formartDate&Time';

describe('should formart the date and time to locale time string when provide an iso time string', () => {
  const isoString: Date = new Date('2024-05-06T14:10:17.613Z');

  it('should formart the date properly', () => {
    const formated = formatDateAndTime(isoString);
    expect(formated.date).toBe('06 May 2024');
  });

  it('should formart the time properly', () => {
    const formatted = formatDateAndTime(isoString);
    console.log(formatted);
    const possibleTimes = ['04:10 PM', '02:10 PM', '05:10 PM'];
    expect(possibleTimes).toContain(formatted.time);
  });
});
