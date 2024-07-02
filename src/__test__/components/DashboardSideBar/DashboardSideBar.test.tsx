import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import DashboardSideBar from '../../../components/Dashboard/DashboardSideBar/DashboardSideBar';

describe('DashboardSideBar', () => {
  it('renders the DashboardSideBar component without crashing', () => {
    render(
      <Router>
        <DashboardSideBar openNav={true} setOpenNav={() => {}} />
      </Router>
    );

    // Check if the component renders the Knight title
    expect(screen.getByText('Knight')).toBeInTheDocument();

    // Check if the component renders the navigation links
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
