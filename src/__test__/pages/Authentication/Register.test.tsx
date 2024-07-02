import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import Register from '../../../pages/Authentication/Register';

describe('Register', () => {
  it('renders the Register component', () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    );

    // Get the specific <h1> element with the value "Register"
    const h1Element = screen.getByText('Sign up', { selector: 'h1' });
    expect(h1Element).toBeInTheDocument();

    //get the specific <p> element with the value "First name"
    const pElement = screen.getByText('First name', { selector: 'p' });
    expect(pElement).toBeInTheDocument();

    //get the specific <p> element with the value "Last name"
    const pElement2 = screen.getByText('Last name', { selector: 'p' });
    expect(pElement2).toBeInTheDocument();

    //get the specific <p> element with the value "Email Address"
    const pElement3 = screen.getByText('Email Address', { selector: 'p' });
    expect(pElement3).toBeInTheDocument();

    //get the specific <p> element with the value "Phone number"
    const pElement4 = screen.getByText('Phone number', { selector: 'p' });
    expect(pElement4).toBeInTheDocument();

    //get the specific <p> element with the value "gender"
    const pElement5 = screen.getByText('Gender', { selector: 'p' });
    expect(pElement5).toBeInTheDocument();

    //get the specific <input> element with the placeholder "John"
    const inputElement = screen.getByPlaceholderText('John');
    expect(inputElement).toBeInTheDocument();

    const eyeIcon = screen.getByTestId('eye-icon');
    fireEvent.click(eyeIcon);

    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    expect(passwordInput.type).toBe('text');

    const eyeIcon2 = screen.getByTestId('eye-icon');
    fireEvent.click(eyeIcon2);
    expect(passwordInput.type).toBe('password');
  });
});
