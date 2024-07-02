import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from '../../../components/Footer/Footer';

describe('Footer', () => {
  it('renders the Footer component', () => {
    render(<Footer />);
    const footerElement = screen.getByText('KNIGHTS STORE');
    expect(footerElement).toBeInTheDocument();
  });
});
