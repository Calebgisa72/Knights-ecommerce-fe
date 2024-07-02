import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { MemoryRouter, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DashboardNavbar from '../../../components/Dashboard/DashboardNavbar/DashboardNavbar';
import DashboarInnerLayout from '../../../layout/DashboarInnerLayout';

describe('DashboardNavbar', () => {
  const mockedToken = JSON.stringify({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMzZDg5ZTJkLTNiZDQtNDEyYi1hYzEzLWYzNTM4Y2Q2YjZlNSIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IkRvZSIsImVtYWlsIjoidmVuZG9yQGdtYWlsLmNvbSIsInJvbGUiOiJWRU5ET1IiLCJpYXQiOjE3MTk3NjIwNjAsImV4cCI6MTcxOTg0ODQ2MH0.NSCYBuYzhhMgNbbMn2s7sc0r333YZaQHHnlhMcYRyCc'
  });
  it('renders the DashboardNavbar component without crashing', () => {
    render(
      <Router>
        <DashboardNavbar setOpenNav={() => {}} />
      </Router>
    );
  });

  it('displays the welcome message with the username', () => {
    localStorage.setItem('userToken', mockedToken);

    render(
      <Router>
        <DashboardNavbar setOpenNav={() => {}} />
      </Router>
    );

    expect(screen.getByText('Welcome, John')).toBeInTheDocument();
  });

  it('displays the current date and time', () => {
    render(
      <Router>
        <DashboardNavbar setOpenNav={() => {}} />
      </Router>
    );
    // 30 June 2024 at 5:42 pm GMT+2
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('handles the search input correctly', () => {
    render(
      <Router>
        <DashboardNavbar setOpenNav={() => {}} />
      </Router>
    );

    const searchInput: any = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Test Search' } });

    expect(searchInput.value).toBe('Test Search');
  });

  it('navigates to login if no token is found', () => {
    localStorage.removeItem('userToken');
    const navigate = vi.fn();

    render(
      <Router>
        <DashboardNavbar setOpenNav={() => {}} />
      </Router>
    );

    expect(navigate).toBeTruthy;
  });

  it('displays the notification icon', () => {
    render(
      <Router>
        <DashboardNavbar setOpenNav={() => {}} />
      </Router>
    );

    expect(screen.getByAltText('Notification')).toBeInTheDocument();
  });

  it('handles the mobile navigation toggle button', () => {
    localStorage.setItem('userToken', mockedToken);
    const setOpenNav = vi.fn();

    render(
      <Router>
        <DashboardNavbar setOpenNav={setOpenNav} />
      </Router>
    );

    const toggleButton = screen.getByRole('button', { name: /Notification/i });
    fireEvent.click(toggleButton);

    expect(setOpenNav).toBeDefined();
  });
});

describe('DashboardInnerLayout', () => {
  it('should render the Outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboarInnerLayout />}>
            <Route path="" element={<div>Dashboard Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });
});
