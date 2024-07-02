import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import Login from '../../../pages/Authentication/Login';
import { MemoryRouter } from 'react-router-dom';

describe('Login', () => {
  it('renders the Login component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    expect(screen.getByPlaceholderText('johnDoe@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    const eyeIcon = screen.getByTestId('eye-icon');
    fireEvent.click(eyeIcon);

    expect(passwordInput.type).toBe('text');

    const eyeIcon2 = screen.getByTestId('eye-icon');
    fireEvent.click(eyeIcon2);
    expect(passwordInput.type).toBe('password');
  });
});
