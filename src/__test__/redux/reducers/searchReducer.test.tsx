import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { searchProducts } from '../../../redux/actions/searchAction';
import searchReducer from '../../../redux/reducers/SearchReducer';

vi.mock('axios');

const store = configureStore({
  reducer: {
    search: searchReducer
  }
});

describe('searchProducts', () => {
  it('returns the search response when the request is successful', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        status: 'success',
        data: {
          products: [
            {
              id: '1',
              name: 'Product 1',
              price: '100',
              owner: 'John Doe',
              image: ['image1.jpg']
            },
            {
              id: '2',
              name: 'Product 2',
              price: '100',
              owner: 'John Doe',
              image: ['image1.jpg']
            }
          ]
        },
        pagination: {
          totalItems: 2,
          currentPage: 1,
          totalPages: 1,
          itemsPerPage: 2
        }
      }
    });

    await store.dispatch(searchProducts({ name: 'Product' }));

    expect(store.getState().search.products);
  });

  it('returns an error when the request fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch products'));

    const store = configureStore({
      reducer: {
        search: searchReducer
      }
    });

    await store.dispatch(searchProducts({ name: 'Product' }));

    expect(store.getState().search.error);
  });
});
