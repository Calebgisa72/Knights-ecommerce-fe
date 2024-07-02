import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../../../redux/store';
import { ResetPassword } from '../../../pages/Authentication/ResetPassword';

describe('ResetPassword', () => {
  it('renders the ResetPassword component', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      </Provider>
    );

    const heading = screen.getByText('Reset your password', { selector: 'h1' });
    expect(heading).toBeInTheDocument();

    const newPasswordLabel = screen.getByText('New password', { selector: 'p' });
    expect(newPasswordLabel).toBeInTheDocument();

    const confirmPasswordLabel = screen.getByText('Confirm password', { selector: 'p' });
    expect(confirmPasswordLabel).toBeInTheDocument();

    const resetButton = screen.getByText('Reset Password');
    expect(resetButton).toBeInTheDocument();

    // Testing eye icon for new password input
    const newPasswordInput = screen.getByTestId('newPassword') as unknown as HTMLInputElement;

    const eyeIcon = screen.getByTestId('eye-icon');
    fireEvent.click(eyeIcon);

    expect(newPasswordInput.type).toBe('text');

    const eyeIcon2 = screen.getByTestId('eye-icon');
    fireEvent.click(eyeIcon2);
    expect(newPasswordInput.type).toBe('password');

    // Testing eye icon for confirm password input
    const confirmPasswordInput = screen.getByTestId('confirmPassword') as unknown as HTMLInputElement;

    const eyeIcon_1 = screen.getByTestId('eye-icon2');
    fireEvent.click(eyeIcon_1);

    expect(confirmPasswordInput.type).toBe('text');

    const eyeIcon_2 = screen.getByTestId('eye-icon2');
    fireEvent.click(eyeIcon_2);
    expect(confirmPasswordInput.type).toBe('password');
  });
});
