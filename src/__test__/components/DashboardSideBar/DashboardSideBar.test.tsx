import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import DashboardSideBar from '../../../components/Dashboard/DashboardSideBar/DashboardSideBar';
import { Provider } from 'react-redux';
import store from '../../../redux/store';

describe('DashboardSideBar', () => {
  it('renders the DashboardSideBar component without crashing', async () => {
    render(
      <Provider store={store}>
        <Router>
          <DashboardSideBar openNav={true} setOpenNav={() => {}} />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Knight/i)).toBeInTheDocument();

      // Check if the component renders the navigation links
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Account')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });
});
