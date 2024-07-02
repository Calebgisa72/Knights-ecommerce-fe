import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, beforeAll } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Navbar from '../../../components/Navbar/Navbar';
import PageTitle from '../../../components/PageTitle';
import store from '../../../redux/store';

describe('Navbar', () => {
  beforeAll(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PageTitle title="Page Title" />
          <Navbar />
        </MemoryRouter>
      </Provider>
    );
  });

  it('renders the Navbar and PageTitle component', () => {
    const navbarElement = screen.getByText('KNIGHTS STORE');
    expect(navbarElement).toBeInTheDocument();
  });

  describe('when user is not logged in', () => {
    it('navigates to search page on Enter key press in search input', () => {
      const history = createMemoryHistory();
      render(
        <Provider store={store}>
          <Router location={history.location} navigator={history}>
            <Navbar />
          </Router>
        </Provider>
      );

      const searchInput = screen.getByPlaceholderText('search for anything');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

      expect(history.location.pathname).toBe('/search');
      expect(history.location.search).toBe('?query=test');
    });

    it('navigates to home page when logo is clicked', () => {
      const history = createMemoryHistory();
      render(
        <Provider store={store}>
          <Router location={history.location} navigator={history}>
            <Navbar />
          </Router>
        </Provider>
      );

      const logo = screen.getByTestId('homePage');
      fireEvent.click(logo);
      expect(history.location.pathname).toBe('/');
    });
  });
});
