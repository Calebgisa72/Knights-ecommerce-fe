import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import Otp from '../../../pages/Authentication/OtpPage';

describe('OtpPage', () => {
  it('Renders the OtpPage component with all expected elements', () => {
    render(
      <Provider store={store}>
        <Otp />
      </Provider>
    );

    const headingElement = screen.getByText('Verify Your Identity', { selector: 'h2' });
    expect(headingElement).toBeInTheDocument();

    const descriptionElement = screen.getByText(/Protecting your account is our priority/i, {
      selector: 'p'
    });
    expect(descriptionElement).toBeInTheDocument();
    // Verify OTP input fields
    const otpInputs = screen.getAllByRole('textbox');
    expect(otpInputs).toHaveLength(6);
    otpInputs.forEach((input) => expect(input).toHaveAttribute('maxLength', '1'));

    const verifyButton = screen.getByRole('button', { name: /Verify/i });
    expect(verifyButton).toBeInTheDocument();

    const resendLink = screen.getByText(/Resend/i, { selector: 'span' });
    expect(resendLink).toBeInTheDocument();
  });

  it('Shows an error if not all OTP fields are filled when submitting', () => {
    render(
      <Provider store={store}>
        <Otp />
      </Provider>
    );

    const verifyButton = screen.getByRole('button', { name: 'Verify' });

    fireEvent.click(verifyButton);
  });
});

describe('OtpPage handleChange', () => {
  it('Updates state correctly when valid digit is entered', () => {
    render(
      <Provider store={store}>
        <Otp />
      </Provider>
    );
    const otpInputs = screen.getAllByRole('textbox');

    otpInputs.forEach((input) => {
      expect(input).toHaveValue('');
    });

    // Simulate entering a digit in each OTP input
    otpInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: `${index + 1}` } });
      expect(input).toHaveValue(`${index + 1}`);
    });
  });

  it('Does not update state when non-digit is entered', () => {
    render(
      <Provider store={store}>
        <Otp />
      </Provider>
    );

    const otpInputs = screen.getAllByRole('textbox');

    // Ensure the inputs are initially empty
    otpInputs.forEach((input) => {
      expect(input).toHaveValue('');
    });

    // Simulate entering a non-digit character
    otpInputs.forEach((input) => {
      fireEvent.change(input, { target: { value: 'a' } });
      expect(input).toHaveValue('');
    });
  });

  it('Does not update state when more than one digit is entered', () => {
    render(
      <Provider store={store}>
        <Otp />
      </Provider>
    );

    const otpInput = screen.getAllByRole('textbox')[0];

    expect(otpInput).toHaveValue('');

    fireEvent.change(otpInput, { target: { value: '12' } });
    expect(otpInput).toHaveValue('');
  });
});
