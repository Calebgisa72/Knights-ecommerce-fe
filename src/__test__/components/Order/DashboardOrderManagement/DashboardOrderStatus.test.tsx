import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import DashboardOrderStatus from '../../../../components/Order/DashboardOrderManagement/DashboardOrderStatus';

describe('DashboardOrderStatus component test', () => {
  it('renders order placed', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardOrderStatus status="order placed" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('order placed', { exact: false })).toBeInTheDocument();
  });
  it('renders received', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardOrderStatus status="received" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('received', { exact: false })).toBeInTheDocument();
  });
  it('renders returned', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardOrderStatus status="returned" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('returned', { exact: false })).toBeInTheDocument();
  });
});
