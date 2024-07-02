import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../../../redux/store';
import { ForgotPassword } from '../../../pages/Authentication/ForgotPassword';
import * as actions from '../../../redux/actions/passwordResetActions';

describe('ForgotPassword', () => {
  it('renders the ForgotPassword component', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );

    // Check for the heading
    const heading = screen.getByText('Forgot your password?', { selector: 'h1' });
    expect(heading).toBeInTheDocument();

    // Check for the instruction text
    const instructionText = screen.getByText("Enter your email and we'll send you a reset link.");
    expect(instructionText).toBeInTheDocument();

    // Check for the email input field
    const emailInput = screen.getByPlaceholderText('johnDoe@gmail.com');
    expect(emailInput).toBeInTheDocument();

    // Check for the "Send Reset Link" button
    const sendButton = screen.getByText('Send Reset Link');
    expect(sendButton).toBeInTheDocument();
  });

  it('shows error when email is not provided', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );

    const sendButton = screen.getByText('Send Reset Link');
    fireEvent.click(sendButton);

    const errorMessage = await screen.findByText('Email is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('dispatches requestPasswordReset action on valid email submission', async () => {
    const requestPasswordResetMock = vi.spyOn(actions, 'requestPasswordReset');

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText('johnDoe@gmail.com');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const sendButton = screen.getByText('Send Reset Link');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(requestPasswordResetMock).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows toast error and dispatches resetState on error', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );

    // Set the initial state with an error
    store.dispatch({
      type: 'password/resetFailed',
      payload: 'Test error message'
    });

    // Assert resetState is dispatched
    const state = store.getState().password;
    expect(state.error).toBe(null);
  });

  it('shows toast success and dispatches resetState on successful response', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );

    // Set the initial state with a successful response
    store.dispatch({
      type: 'password/resetSucceeded',
      payload: { data: { message: 'Password reset link sent successfully' } }
    });

    // Assert resetState is dispatched
    const state = store.getState().password;
    expect(state.resetPassword).toBe(null);
  });

  it('shows toast error and dispatches resetState on failed response', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ForgotPassword />
        </BrowserRouter>
      </Provider>
    );

    // Set the initial state with a failed response
    store.dispatch({
      type: 'password/resetFailed',
      payload: 'Test error message'
    });

    // Assert resetState is dispatched
    const state = store.getState().password;
    expect(state.error).toBe(null);
  });
});
