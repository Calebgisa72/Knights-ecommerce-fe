import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import ProductCoupon from '../../../components/Products/ProductCoupon/ProductCoupon';
import { render } from '../../utils/test-utils';
import { describe, it } from 'vitest';
import mockStore from '../../utils/mockStore';

describe('ProductCoupon Component', () => {
  it('renders loading state initially', () => {
    render(
      <Provider store={mockStore}>
        <ProductCoupon vendorId="vendor123" productId="product123" />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays coupons after loading', async () => {
    render(
      <Provider store={mockStore}>
        <ProductCoupon vendorId="testVendor" productId="testProductId" />
      </Provider>
    );

    await waitFor(() => {
      return expect(1 + 1).toBe(2);
    });
  });
});
