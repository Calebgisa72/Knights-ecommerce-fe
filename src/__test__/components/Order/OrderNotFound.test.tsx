import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import OrderNotFound from '../../../components/Order/OrderNotFound';

describe('OrderNotFound component test', () => {
  it('renders completed', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OrderNotFound link="/orders" />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('ORDER NOT FOUND!', { exact: false })).toBeInTheDocument();
  });
});
