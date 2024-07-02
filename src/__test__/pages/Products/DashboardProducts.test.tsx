import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Provider } from 'react-redux';
import DashboardProducts from '../../../components/Products/DashboardProducts/DashboardProducts';
import store from '../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import DashboardLayout from '../../../layout/DashboardLayout';

describe('DashboardProducts', () => {
  it('renders the DashboardProducts component without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardProducts />
        </MemoryRouter>
      </Provider>
    );

    // Check if the component renders the title
    expect(screen.getByText('All Products')).toBeInTheDocument();

    // Check if the component renders the search input
    expect(screen.getByPlaceholderText('Search by Name, Category..')).toBeInTheDocument();

    // Check if the component renders the filter button
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('displays loading indicator when products are being fetched', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardProducts />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardProducts />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Something went wrong please try again')).toBeInTheDocument();
  });
  it('renders DashboardLayout component without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardLayout />
        </MemoryRouter>
      </Provider>
    );

    // Check if the sidebar is rendered
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();

    // Check if the navbar is rendered
    expect(screen.getByTestId('navbar')).toBeInTheDocument();

    // Check if the outlet is present for nested routes
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
});
