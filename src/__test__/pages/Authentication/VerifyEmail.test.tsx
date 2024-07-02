import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import verifyEmailReducer from '../../../redux/reducers/verifyEmailReducer';
import VerifyEmail from '../../../pages/Authentication/VerifyEmail';

const renderWithStore = (preloadedState: any) => {
  const mockStore = configureStore({
    reducer: combineReducers({
      verifyEmail: verifyEmailReducer
    }),
    preloadedState
  });

  return render(
    <Provider store={mockStore}>
      <VerifyEmail />
    </Provider>
  );
};

describe('VerifyEmail', () => {
  it('renders the loading state with "Verifying your email" text', () => {
    renderWithStore({
      verifyEmail: {
        verify: null,
        loading: true,
        error: null
      }
    });

    const pElement = screen.getByText('Verifying your email', { selector: 'p' });
    expect(pElement).toBeInTheDocument();
  });

  it('renders the success state with "Email verified successfully!" text and login link', () => {
    renderWithStore({
      verifyEmail: {
        verify: { message: 'Email verified successfully!' },
        loading: false,
        error: null
      }
    });

    const successMessage = screen.getByText('Email verified successfully!', { selector: 'p' });
    expect(successMessage).toBeInTheDocument();
    const loginLink = screen.getByText('Login', { selector: 'a' });
    expect(loginLink).toBeInTheDocument();
  });

  it('renders the error state with "Something went wrong" text', () => {
    renderWithStore({
      verifyEmail: {
        verify: null,
        loading: false,
        error: 'Something went wrong'
      }
    });

    const errorMessage = screen.getByText('Something went wrong', { selector: 'p' });
    expect(errorMessage).toBeInTheDocument();
    const tryAgainMessage = screen.getByText('Try again or contact support', { selector: 'p' });
    expect(tryAgainMessage).toBeInTheDocument();
  });
});
