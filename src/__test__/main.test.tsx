// src/index.test.tsx

import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';
import { describe, it } from 'vitest';
describe('Root Component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
      {
        container: div
      }
    );

    expect(div.querySelector('div')).toBeInTheDocument();
  });
});
