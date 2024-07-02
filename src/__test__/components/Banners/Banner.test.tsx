import React from 'react';
import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import Banner from '../../../components/Banners/Banner';

describe('Landing Page Banner', () => {
  it('renders the Banner component', () => {
    render(
      <Router>
        <Banner rate={50} time="1 Month ago" image="banner.jpg" />
      </Router>
    );
  });
});
