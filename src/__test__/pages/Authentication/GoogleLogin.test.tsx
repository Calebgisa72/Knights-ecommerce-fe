import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import GoogleLogin from '../../../pages/Authentication/GoogleLogin';

vi.mock('axios');

describe('GoogleLogin component', () => {
  it('renders the GoogleLogin component', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <GoogleLogin />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const spanElement = screen.getByText('Signing in with Google');
      expect(spanElement).toBeInTheDocument();
    });
  });

  it('for success status with token', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login/google-auth?status=success&token=fakeToken&role=buyer']}>
          <GoogleLogin />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
  it('for success status without token', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login/google-auth?status=success&role=buyer']}>
          <GoogleLogin />
        </MemoryRouter>
      </Provider>
    );
  });

  it('for userSuspended status', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login/google-auth?status=userSuspended']}>
          <GoogleLogin />
        </MemoryRouter>
      </Provider>
    );
  });
  it('for error status', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login/google-auth?status=error']}>
          <GoogleLogin />
        </MemoryRouter>
      </Provider>
    );
  });
  it('for otp status with email', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login/google-auth?status=otp&email=abc@gmail.com']}>
          <GoogleLogin />
        </MemoryRouter>
      </Provider>
    );
  });
  it('for otp status without email', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login/google-auth?status=otp']}>
          <GoogleLogin />
        </MemoryRouter>
      </Provider>
    );
  });
});
