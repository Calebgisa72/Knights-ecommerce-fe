import { searchProducts } from '../../../redux/actions/searchAction';
import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../../../redux/reducers/SearchReducer';
import { SearchProductParams } from '../../../types/searchTypes';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const store = configureStore({
  reducer: {
    search: searchReducer
  }
});

describe('Search Products Actions', () => {
  it('should handle searchProducts success', async () => {
    const responseData = {
      status: 'success',
      data: [
        {
          id: '1',
          name: 'Test Product',
          newPrice: '100',
          vendor: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: '',
            phoneNumber: '',
            photoUrl: null
          },
          images: ['image1.jpg'],
          description: '',
          oldPrice: '23',
          expirationDate: '',
          quantity: 0,
          isAvailable: true,
          createdAt: '',
          updatedAt: '',
          categories: [],
          feedbacks: []
        },
        {
          id: '2',
          name: 'Test Product 3',
          newPrice: '100',
          vendor: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: '',
            phoneNumber: '',
            photoUrl: null
          },
          images: ['image1.jpg'],
          description: '',
          oldPrice: '0',
          expirationDate: '',
          quantity: 0,
          isAvailable: true,
          createdAt: '',
          updatedAt: '',
          categories: [],
          feedbacks: []
        }
      ],
      pagination: {
        totalItems: 10,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10
      }
    };
    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    const searchParams: SearchProductParams = {
      name: 'test',
      sortBy: 'name',
      sortOrder: 'ASC',
      page: 1,
      limit: 10
    };
    const result = await store.dispatch(searchProducts(searchParams));

    expect(result.payload).toEqual(responseData);

    expect(store.getState().search).toEqual({
      loading: false,
      error: null,
      products: responseData
    });
  });

  it('should handle searchProducts error', async () => {
    const errorMessage = 'Failed to search products';
    mockedAxios.get.mockRejectedValueOnce({ message: errorMessage });

    try {
      await store.dispatch(searchProducts({}));
    } catch (err) {
      expect(store.getState().search).toEqual({
        loading: false,
        error: errorMessage,
        searchResults: null
      });
    }
  });
});
