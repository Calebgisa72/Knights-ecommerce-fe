import { describe, it, vi, beforeEach } from 'vitest';
import handleError from '../../utils/errorHandler';

vi.mock('react-hot-toast', async () => {
  const actual = await vi.importActual<typeof import('react-hot-toast')>('react-hot-toast');
  return {
    ...actual,
    toast: {
      ...actual.toast,
      error: vi.fn()
    }
  };
});

describe('handleError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls toast.error with the message from axios error response', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        data: {
          message: 'Custom error message'
        }
      }
    };

    handleError(axiosError);
  });
});
