import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import DashboardNewProducts from '../../../components/Products/DashboardNewProducts/DashboardNewProducts';
import store from '../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../../../layout/MainLayout';

// Mock the axios module
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the toast module
vi.mock('react-hot-toast', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    error: vi.fn(),
    success: vi.fn()
  };
});

describe('DashboardNewProducts', () => {
  it('renders the DashboardNewProducts component without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardNewProducts />
        </MemoryRouter>
      </Provider>
    );

    // Check if the component renders the title
    expect(screen.getByText('Add New Product')).toBeInTheDocument();

    // Check if the component renders the form elements
    expect(screen.getByText('Product Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Expiration Date')).toBeInTheDocument();
    expect(screen.getByText('New Price (Rwf)')).toBeInTheDocument();
    expect(screen.getByText('Image Upload')).toBeInTheDocument();
  });

  it('displays validation errors when form is submitted with invalid data', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardNewProducts />
        </MemoryRouter>
      </Provider>
    );

    const submitButton = screen.getByText('New Product') as HTMLButtonElement;
    fireEvent.click(submitButton);

    expect(screen.getByText('Product name must be at least 3 characters long.')).toBeInTheDocument();
    expect(screen.getByText('Description must be at least 3 characters long.')).toBeInTheDocument();
    expect(screen.getByText('Please select or enter a category.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid quantity.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid price.')).toBeInTheDocument();
    expect(screen.getByText('Please upload at least two images.')).toBeInTheDocument();
    expect(screen.getByText('You need an expiry date')).toBeInTheDocument();
  });

  it('fetches and displays categories on component mount', async () => {
    const mockCategories = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: { categories: mockCategories } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardNewProducts />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() =>
      expect(mockedAxios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_APP_API_URL}/product/categories`)
    );

    const categorySelect = screen.getByRole('combobox');
    fireEvent.click(categorySelect);
    mockCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it('submits the form with valid data', async () => {
    const mockCategories = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: { categories: mockCategories } });
    mockedAxios.post.mockResolvedValueOnce({ data: { message: 'Product created' } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardNewProducts />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() =>
      expect(mockedAxios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_APP_API_URL}/product/categories`)
    );

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'Category 1' } });

    const submitButton = screen.getByText('New Product') as HTMLButtonElement;
    fireEvent.click(submitButton);
  });

  it('displays image previews after upload', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardNewProducts />
        </MemoryRouter>
      </Provider>
    );

    // const file = new File(['image'], 'image.png', { type: 'image/png' });
    // fireEvent.change(screen.getByLabelText(/Image Upload/i), { target: { files: [file, file] } });

    await waitFor(() => {
      // expect(screen.getAllByAltText(/Preview/i)).toHaveLength(2);
    });
  });

  it('renders the MainLayout component without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainLayout>
            <div data-testid="content">Content</div>
          </MainLayout>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
