import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../../pages/LandingPage/Home';
import store from '../../../redux/store';
import { Provider } from 'react-redux';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Home( landing page) test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: { products: [] } } });
  });

  it('renders the Home Page', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );

    const shopElement = screen.getByText('Shop');
    expect(shopElement).toBeInTheDocument();
  });
});

it('fetches and displays products', async () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Product 1',
      images: ['image1.jpg'],
      categories: [{ name: 'Category 1' }],
      newPrice: 100,
      oldPrice: 120,
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Product 2',
      images: ['image2.jpg'],
      categories: [{ name: 'Category 2' }],
      newPrice: 200,
      oldPrice: 240,
      updatedAt: new Date()
    }
  ];

  const mockCategories = [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' }
  ];

  mockedAxios.get.mockResolvedValueOnce({ data: { categories: mockCategories } });

  (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: { products: mockProducts } } });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });
});

it('displays products based on selected category', async () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Product 1',
      images: ['image1.jpg'],
      categories: [{ name: 'Category 1' }],
      newPrice: 100,
      oldPrice: 120,
      updatedAt: new Date().toISOString()
    }
  ];

  const mockCategories = [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' }
  ];

  mockedAxios.get.mockResolvedValueOnce({ data: { categories: mockCategories } });

  (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: { products: mockProducts } } });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });
});

it('displays loading state and handles empty products', async () => {
  (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: { products: [] } } });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
});

it('loads more products when "Load more" button is clicked', async () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Product 1',
      images: ['image1.jpg'],
      categories: [{ name: 'Category 1' }],
      newPrice: 100,
      oldPrice: 120,
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Product 2',
      images: ['image2.jpg'],
      categories: [{ name: 'Category 2' }],
      newPrice: 200,
      oldPrice: 240,
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Product 3',
      images: ['image3.jpg'],
      categories: [{ name: 'Category 1' }],
      newPrice: 100,
      oldPrice: 120,
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Product 4',
      images: ['image4.jpg'],
      categories: [{ name: 'Category 2' }],
      newPrice: 200,
      oldPrice: 240,
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Product 5',
      images: ['image5.jpg'],
      categories: [{ name: 'Category 1' }],
      newPrice: 100,
      oldPrice: 120,
      updatedAt: new Date()
    },
    {
      id: '6',
      name: 'Product 6',
      images: ['image6.jpg'],
      categories: [{ name: 'Category 2' }],
      newPrice: 200,
      oldPrice: 240,
      updatedAt: new Date()
    },
    {
      id: '7',
      name: 'Product 7',
      images: ['image7.jpg'],
      categories: [{ name: 'Category 1' }],
      newPrice: 100,
      oldPrice: 120,
      updatedAt: new Date()
    },
    {
      id: '8',
      name: 'Product 8',
      images: ['image8.jpg'],
      categories: [{ name: 'Category 2' }],
      newPrice: 200,
      oldPrice: 240,
      updatedAt: new Date()
    },
    {
      id: '10',
      name: 'Product 9',
      images: ['image9.jpg'],
      categories: [{ name: 'Category 1' }],
      newPrice: 100,
      oldPrice: 120,
      updatedAt: new Date()
    },
    {
      id: '11',
      name: 'Product 10',
      images: ['image10.jpg'],
      categories: [{ name: 'Category 2' }],
      newPrice: 200,
      oldPrice: 240,
      updatedAt: new Date()
    },
    {
      id: '12',
      name: 'Product 11',
      images: ['image11.jpg'],
      categories: [{ name: 'Category 1' }],
      newPrice: 100,
      oldPrice: 120,
      updatedAt: new Date()
    },
    {
      id: '13',
      name: 'Product 12',
      images: ['image12.jpg'],
      categories: [{ name: 'Category 2' }],
      newPrice: 200,
      oldPrice: 240,
      updatedAt: new Date()
    },
    {
      id: '14',
      name: 'Product 13',
      images: ['image13.jpg'],
      categories: [{ name: 'Category 1' }],
      newPrice: 100,
      oldPrice: 120,
      updatedAt: new Date()
    }
  ];

  const mockCategories = [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' }
  ];
  mockedAxios.get.mockResolvedValueOnce({ data: { categories: mockCategories } });

  (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: { products: mockProducts } } });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() => {
    const loadMoreButton = screen.getByRole('button', { name: 'Load more products' });
    expect(loadMoreButton).toBeInTheDocument();
    expect(loadMoreButton.tagName).toBe('BUTTON');
  });
  fireEvent.click(screen.getByText('Load more products'));

  await waitFor(() => {
    expect(screen.getByText('Product 3')).toBeInTheDocument();
    expect(screen.getByText('Product 4')).toBeInTheDocument();
    expect(screen.getByText('Product 5')).toBeInTheDocument();
  });
});
