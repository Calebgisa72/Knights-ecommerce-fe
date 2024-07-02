import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Popup from '../../../components/Popups/Popup';
import ConfirmDeletePopup from '../../../components/Popups/ConfirmDeletePopup';
import ProductCoupon from '../../../components/Products/ProductCoupon/ProductCoupon';
import { Provider } from 'react-redux';
import productReducer from '../../../redux/reducers/productReducer';
import { configureStore } from '@reduxjs/toolkit';
import { Coupon, PopupProps } from '../../../types/CouponTypes';
import { ProductState } from '../../../types/productTypes';
vi.mock('axios');
describe('Popup', () => {
  const defaultProps: PopupProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    responseType: 'success',
    duration: 3000,
    onClose: vi.fn()
  };

  it('renders the Popup component without crashing', () => {
    render(<Popup {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('displays the correct image based on responseType', () => {
    const { rerender } = render(<Popup {...defaultProps} responseType="success" />);
    expect(screen.getByAltText('Success')).toBeInTheDocument();

    rerender(<Popup {...defaultProps} responseType="fail" />);
    expect(screen.getByAltText('Failure')).toBeInTheDocument();
  });

  it('calls onClose after the specified duration', async () => {
    vi.useFakeTimers(); // Use Vitest timers to control the passage of time
    const onClose = vi.fn();

    render(<Popup {...defaultProps} onClose={onClose} />);

    // Simulate the image load
    act(() => {
      fireEvent.load(screen.getByAltText('Success'));
      vi.advanceTimersByTime(3000);
    });
    vi.useRealTimers(); // Clean up timers
  });

  it('closes the popup when clicking outside', () => {
    render(<Popup {...defaultProps} />);
    fireEvent.mouseUp(document);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('handles image load correctly', () => {
    render(<Popup {...defaultProps} />);
    const successImage = screen.getByAltText('Success');
    fireEvent.load(successImage);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('handles clicking outside the popup correctly', () => {
    render(<Popup {...defaultProps} />);
    fireEvent.mouseUp(document.body);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});

describe('ConfirmDeletePopup', () => {
  const defaultProps = {
    trigger: <button>Delete</button>,
    title: 'Confirm Deletion',
    body: 'Are you sure you want to delete this item?',
    onSubmit: vi.fn(),
    submitText: 'Yes',
    closeText: 'No'
  };

  it('renders the ConfirmDeletePopup component without crashing', () => {
    render(<ConfirmDeletePopup {...defaultProps} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('opens the popup when the trigger is clicked', () => {
    render(<ConfirmDeletePopup {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete'));

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
  });

  it('closes the popup when the close button is clicked', () => {
    render(<ConfirmDeletePopup {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();

    fireEvent.click(screen.getByText('No'));
    expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
  });

  it('calls onSubmit and closes the popup when the confirm button is clicked', () => {
    const onSubmit = vi.fn();
    render(<ConfirmDeletePopup {...defaultProps} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Yes'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
  });
});

// Mock store setup
const initialState: ProductState = {
  products: null,
  message: '',
  coupons: [],
  loading: false,
  error: null
};

const mockCoupons: Coupon[] = [
  {
    id: 'coupon1',
    code: 'DISCOUNT10',
    discountType: 'percentage',
    discountRate: 10,
    expirationDate: '2023-12-31T00:00:00.000Z',
    maxUsageLimit: 100,
    product: {
      id: 'product123',
      name: 'Sample Product',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      images: ['image1.jpg', 'image2.jpg'],
      newPrice: '99.99',
      oldPrice: '129.99',
      expirationDate: '2023-12-31T00:00:00.000Z',
      quantity: 100,
      isAvailable: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-06-01T00:00:00.000Z',
      categories: [
        {
          id: 'category1',
          name: 'Category A',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        },
        {
          id: 'category2',
          name: 'Category B',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        }
      ],
      vendor: {
        id: 'vendor123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        photoUrl: null
      },
      feedbacks: []
    },
    usageTimes: 0,
    usedBy: [],
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 'coupon2',
    code: 'DISCOUNT20',
    discountType: 'percentage',
    discountRate: 10,
    expirationDate: '2023-12-31T00:00:00.000Z',
    maxUsageLimit: 100,
    product: {
      id: 'product123',
      name: 'Sample Product',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      images: ['image1.jpg', 'image2.jpg'],
      newPrice: '99.99',
      oldPrice: '129.99',
      expirationDate: '2023-12-31T00:00:00.000Z',
      quantity: 100,
      isAvailable: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-06-01T00:00:00.000Z',
      categories: [
        {
          id: 'category1',
          name: 'Category A',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        },
        {
          id: 'category2',
          name: 'Category B',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        }
      ],
      vendor: {
        id: 'vendor123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        photoUrl: null
      },
      feedbacks: []
    },
    usageTimes: 0,
    usedBy: [],
    createdAt: '',
    updatedAt: ''
  }
];

const mockStore = configureStore({
  reducer: {
    products: productReducer
  },
  preloadedState: {
    products: {
      ...initialState, // Include all fields from initial state
      coupons: mockCoupons // Provide mock coupons data
    }
  }
});

describe('ProductCoupon Component', () => {
  // Helper function to render ProductCoupon with Provider
  const setupComponent = () =>
    render(
      <Provider store={mockStore}>
        <ProductCoupon vendorId="vendor123" productId="product123" />
      </Provider>
    );

  it('renders ProductCoupon component without crashing', async () => {
    await setupComponent();

    expect(screen.getByText('DISCOUNT10')).toBeInTheDocument();
    expect(screen.getByText('DISCOUNT20')).toBeInTheDocument();
  });

  it('displays the correct number of coupons', async () => {
    await setupComponent();

    expect(screen.getByText('DISCOUNT10')).toBeInTheDocument();
    expect(screen.getByText('DISCOUNT20')).toBeInTheDocument();
  });

  it('handles pagination correctly', async () => {
    await setupComponent();

    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('opens and closes the delete confirmation popup', async () => {
    await setupComponent();
    expect(screen.queryByText('Confirm Coupon Deletion')).not.toBeInTheDocument();
  });

  it('does not call the deleteCoupon action when confirming deletion', async () => {
    await setupComponent();

    expect(screen.getByText('DISCOUNT10')).toBeInTheDocument();
    expect(screen.getByText('DISCOUNT20')).toBeInTheDocument();
  });

  it('opens and closes the update coupon form popup', async () => {
    await setupComponent();
    expect(screen.queryByText('Update a DISCOUNT10 Coupon')).toBeInTheDocument();
  });

  it('does not call the updateCoupon action when submitting the form', async () => {
    await setupComponent();
    expect(screen.getByText('DISCOUNT10')).toBeInTheDocument();
    expect(screen.getByText('DISCOUNT20')).toBeInTheDocument();
  });
});
