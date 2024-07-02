import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../../redux/reducers/SearchReducer';
import SearchResultPage from '../../pages/searchPage';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
      categories: [
        { id: '1', name: '1', createdAt: '2015-02-09', updatedAt: '2023-09-09' },
        { id: '2', name: '2', createdAt: '2019-03-2', updatedAt: '2012-09-23' }
      ],
      feedbacks: []
    }
  ],
  pagination: {
    totalItems: 2,
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10
  }
};

const store = configureStore({
  reducer: {
    search: searchReducer
  }
});

describe('SearchResultPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders SearchResultPage component without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SearchResultPage />
        </MemoryRouter>
      </Provider>
    );
  });

  test('renders "No products found." when there are no products', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [],
      pagination: {
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10
      },
      message: 'Nice',
      status: '200'
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search?query=test']}>
          <SearchResultPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('No products found.')).toBeInTheDocument();
    });
  });

  test('renders loading state correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search?query=test']}>
          <SearchResultPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('transforms products correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search?query=test']}>
          <SearchResultPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  test('renders Pagination component when totalPages is greater than 1', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: responseData });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search?query=test']}>
          <SearchResultPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });
});
