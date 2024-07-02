// SuspendedAccount.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SuspendedAccount from '../../../components/SuspendedAccount/SuspendedAccount';

describe('SuspendedAccount', () => {
  it('renders the SuspendedAccount component', () => {
    render(<SuspendedAccount />);

    const imgElement = screen.getByAltText('');
    expect(imgElement).toBeInTheDocument();

    const suspendedTextElement = screen.getByText('Your account has been suspended!', {
      selector: 'p'
    });
    expect(suspendedTextElement).toBeInTheDocument();

    const supportTextElement = screen.getByText(/Please contact our support team at/i);
    expect(supportTextElement).toBeInTheDocument();

    const supportLinkElement = screen.getByText('knights@andela.com');
    expect(supportLinkElement).toBeInTheDocument();
    expect(supportLinkElement).toHaveAttribute('href', 'mailto:knights@andela.com');
  });
});
