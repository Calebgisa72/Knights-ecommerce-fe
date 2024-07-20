import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { vi } from 'vitest';
import { setCredentials } from '../../redux/reducers/authReducer';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '../../Routes/ProtectedRoute';
import NotFound from '../../Routes/NotFound';
import NotAllowed from '../../Routes/NotAllowed';

vi.mock('axios');
vi.mock('../../utils/errorHandler');

const userToken = 'Testing Login';

describe('Protected route test', () => {
  beforeEach(() => {
    store.dispatch(setCredentials(userToken));
    vi.resetAllMocks();
  });

  it('should render children if Admin is provided and role matches', () => {
    store.dispatch(
      setCredentials(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIwOGEwMmFlLTAyMWMtNDhiMC05ODNiLWI2MzM1YjU4OWVlYiIsImZpcnN0TmFtZSI6IkNsaWVudCIsImxhc3ROYW1lIjoiRG9lIiwiZW1haWwiOiJidXllckBnbWFpbC5jb20iLCJyb2xlIjoiQlVZRVIiLCJpYXQiOjE3MjA5NTk2ODIsImV4cCI6MTcyMTA0NjA4Mjl9.lRKy_hPB1WazJqcsaT9bKs78zJRQsbb9iJFD1ux_J3U'
      )
    );
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Provider store={store}>
          <Routes>
            <Route
              path="protected"
              element={
                <ProtectedRoute requiredRole="admin">
                  <NotAllowed />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByText('You are not allowed to access this page.')).toBeInTheDocument();
  });
  it('should render children if Buyer is provided and role matches', () => {
    store.dispatch(
      setCredentials(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIwOGEwMmFlLTAyMWMtNDhiMC05ODNiLWI2MzM1YjU4OWVlYiIsImZpcnN0TmFtZSI6IkNsaWVudCIsImxhc3ROYW1lIjoiRG9lIiwiZW1haWwiOiJidXllckBnbWFpbC5jb20iLCJyb2xlIjoiQnV5ZXIiLCJpYXQiOjE3MjA5NTk2ODIsImV4cCI6MTcyMTA0NjA4Mjl9.-6VudtWJjvpRS9xmh4XZqz0alOAYt9y7Ei5LNOC3WQ0'
      )
    );
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Provider store={store}>
          <Routes>
            <Route
              path="protected"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <NotAllowed />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByText('You are not allowed to access this page.')).toBeInTheDocument();
  });
  it('should render children if Vendor is provided and role matches', () => {
    store.dispatch(
      setCredentials(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIwOGEwMmFlLTAyMWMtNDhiMC05ODNiLWI2MzM1YjU4OWVlYiIsImZpcnN0TmFtZSI6IkNsaWVudCIsImxhc3ROYW1lIjoiRG9lIiwiZW1haWwiOiJidXllckBnbWFpbC5jb20iLCJyb2xlIjoiVmVuZG9yIiwiaWF0IjoxNzIwOTU5NjgyLCJleHAiOjE3MjEwNDYwODI5fQ.pCD3dIm5Wd8HxtSPSL4-gXkiwi1Y7lCcHQ_H57RmciQ'
      )
    );
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Provider store={store}>
          <Routes>
            <Route
              path="protected"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <NotFound />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });
});
