import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import BuyerOrderStatus from '../../../components/Order/BuyerOrderStatus';

describe('BuyerOrderStatus component test', () => {
  it('renders order placed', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BuyerOrderStatus status="order placed" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('order placed', { exact: false })).toBeInTheDocument();
  });
  it('renders completed', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BuyerOrderStatus status="completed" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('completed', { exact: false })).toBeInTheDocument();
  });
  it('renders received', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BuyerOrderStatus status="received" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('received', { exact: false })).toBeInTheDocument();
  });
  it('renders returned', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BuyerOrderStatus status="returned" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('returned', { exact: false })).toBeInTheDocument();
  });
  it('renders cancelled', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BuyerOrderStatus status="cancelled" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('cancelled', { exact: false })).toBeInTheDocument();
  });
  it('renders awaiting shipment', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BuyerOrderStatus status="awaiting shipment" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('awaiting shipment', { exact: false })).toBeInTheDocument();
  });
});
