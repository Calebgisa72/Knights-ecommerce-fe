import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the WelcomePage component', () => {
    render(
      <Router>
        <App />
      </Router>
    );

    const landingPageElement = screen.getByText('Explore our collections');
    expect(landingPageElement).toBeInTheDocument();

    const categoryElement = screen.getByText('Electronic...');
    expect(categoryElement).toBeInTheDocument();
  });
});
