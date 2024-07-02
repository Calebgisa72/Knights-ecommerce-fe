import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, Mocked } from 'vitest';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import GoogleLoginSuccess from '../../../pages/Authentication/GoogleLoginSuccess';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

describe('GoogleLoginSuccess', () => {
  it('renders the GoogleLogin component', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { data: { message: 'Please provide the OTP sent to your email or phone' } }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <GoogleLoginSuccess />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const spanElement = screen.getByText('Signing in with Google');
      expect(spanElement).toBeInTheDocument();
    });
  });

  it('handles error from axios', async () => {
    mockedAxios.get.mockRejectedValue({
      response: {
        data: {
          message: 'Your account has been suspended'
        }
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <GoogleLoginSuccess />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });
});
