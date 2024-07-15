import { GetOrders, UpdateFeedback, deleteFeedback } from '../../../redux/actions/OrdersAction';
import HttpRequest from '../../../services/HttpRequest';
import toast from 'react-hot-toast';

vi.mock('../../../services/HttpRequest');
vi.mock('react-hot-toast');

describe('Async Thunks', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GetOrders', () => {
    it('fetches orders successfully', async () => {
      const mockResponse = { data: ['order1', 'order2'] };
      (HttpRequest.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await GetOrders()(vi.fn(), vi.fn(), undefined);
      expect(result.payload).toEqual(mockResponse.data);
    });

    it('handles error during order fetching', async () => {
      const mockError = { response: { data: 'Error fetching orders' } };
      (HttpRequest.get as jest.Mock).mockRejectedValueOnce(mockError);

      const result = await GetOrders()(vi.fn(), vi.fn(), undefined);
      expect(result.payload).toEqual(mockError.response.data);
    });
  });

  describe('UpdateFeedback', () => {
    it('updates feedback successfully', async () => {
      const mockResponse = { data: { message: 'Feedback updated successfully' } };
      const feedbackArgs = { feedbackId: '1', data: { content: 'Great product!' } };
      (HttpRequest.put as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await UpdateFeedback(feedbackArgs)(vi.fn(), vi.fn(), undefined);
      expect(result.payload).toEqual(mockResponse.data);
      expect(toast.success).toHaveBeenCalledWith(mockResponse.data.message);
    });

    it('handles error during feedback update', async () => {
      const mockError = { response: { data: 'Error updating feedback' } };
      const feedbackArgs = { feedbackId: '1', data: { content: 'Great product!' } };
      (HttpRequest.put as jest.Mock).mockRejectedValueOnce(mockError);

      const result = await UpdateFeedback(feedbackArgs)(vi.fn(), vi.fn(), undefined);
      expect(result.payload).toEqual(mockError.response.data);
    });
  });

  describe('deleteFeedback', () => {
    it('deletes feedback successfully', async () => {
      const mockResponse = { data: { message: 'Feedback deleted successfully' } };
      const feedbackArgs = { feedbackId: '1' };
      (HttpRequest.delete as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await deleteFeedback(feedbackArgs)(vi.fn(), vi.fn(), undefined);
      expect(result.payload).toEqual(mockResponse.data);
      expect(toast.success).toHaveBeenCalledWith(mockResponse.data.message);
    });

    it('handles error during feedback deletion', async () => {
      const mockError = { response: { data: 'Error deleting feedback' } };
      const feedbackArgs = { feedbackId: '1' };
      (HttpRequest.delete as jest.Mock).mockRejectedValueOnce(mockError);

      const result = await deleteFeedback(feedbackArgs)(vi.fn(), vi.fn(), undefined);
      expect(result.payload).toEqual(mockError.response.data);
    });
  });
});
