import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { describe, it } from 'vitest';
import DashboardAccount from '../../components/Dashboard/DashboardAccount/DashboardAccount';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Toaster } from 'react-hot-toast';
import jest from 'jest-mock';
import { setCredentials } from '../../redux/reducers/authReducer';

const mockAxios = new MockAdapter(axios);

const adminTestToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY4OTFiNDg2LWY0YTUtNGU5Ny05MjBjLWFiOTAyZTU5MTgwZiIsImZpcnN0TmFtZSI6ImtuaWdodCIsImxhc3ROYW1lIjoiam9lIiwiZW1haWwiOiJ0ZXRvYm9ibzJAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzIxNzM3NDAwLCJleHAiOjE3MjE4MjM4MDB9.GLO0gxz17g1Jrkt_VDoEzzhk4RhlWV8ZlnP_GevcPX4';
const buyerTestToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YWJkZjZhLWFmOTgtNDI5Zi1hZDBkLWZhZTM1NzE4OGM2NCIsImZpcnN0TmFtZSI6Impvc2VwaCIsImxhc3ROYW1lIjoiVGV0byIsImVtYWlsIjoidGV0b2JvYm80M0BnbWFpbC5jb20iLCJyb2xlIjoiQlVZRVIiLCJpYXQiOjE3MjE3Mzc4MTksImV4cCI6MTcyMTgyNDIxOX0.-vnYlAzAYAqsamkvYZ0tJ3ZUk6mHYVHc2ANXo23HSyk';

describe('Dashboard Account test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockAxios.reset();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
  });

  it('should render DashboardAccount Component', async () => {
    store.dispatch(setCredentials(adminTestToken));
    mockAxios.onGet(`${import.meta.env.VITE_APP_API_URL}/user/profile`).reply(200, {
      status: 'success',
      data: {
        code: 200,
        message: 'Profile fetched successfully',
        profile: {
          id: '11ad3b04-35e7-4702-974b-e92dd52b3e56',
          firstName: 'joe',
          lastName: 'store',
          email: 'test@gmail.com',
          gender: 'Male',
          phoneNumber: '0789412421',
          photoUrl: null,
          verified: true,
          status: 'active',
          userType: 'Vendor',
          twoFactorEnabled: false,
          role: 'VENDOR',
          createdAt: '2024-07-03T09:05:09.447Z',
          updatedAt: '2024-07-18T19:01:07.295Z',
          accountBalance: '0.00'
        }
      }
    });

    render(
      <Provider store={store}>
        <DashboardAccount />
      </Provider>
    );

    await waitFor(() => {
      const h1TitleElement = screen.getByText('Your Account', { selector: 'h1' });
      expect(h1TitleElement).toBeInTheDocument();

      const accontElement = screen.getByText('Account', { selector: 'span' });
      expect(accontElement).toBeInTheDocument();

      const h2TitleElement = screen.getByText('Profile Information', { selector: 'h1' });
      expect(h2TitleElement).toBeInTheDocument();

      const img1 = screen.getByRole('profileTest');
      expect(img1).toBeInTheDocument();

      const img2 = screen.getByRole('uploadIcon');
      expect(img2).toBeInTheDocument();

      const h2TitleElement2 = screen.getByText('Basic Info', { selector: 'h2' });
      expect(h2TitleElement2).toBeInTheDocument();

      const spanElement1 = screen.getByText('Status', { selector: 'span' });
      expect(spanElement1).toBeInTheDocument();

      const spanElement3 = screen.getByText('Member since', { selector: 'span' });
      expect(spanElement3).toBeInTheDocument();

      const spanElement4 = screen.getByText('Role', { selector: 'span' });
      expect(spanElement4).toBeInTheDocument();

      const spanElement5 = screen.getByText('Vendor', { selector: 'span' });
      expect(spanElement5).toBeInTheDocument();

      const spanElement6 = screen.getByText('03 Jul 2024', { selector: 'span' });
      expect(spanElement6).toBeInTheDocument();

      const spanElement7 = screen.getByText('No file choosen', { selector: 'span' });
      expect(spanElement7).toBeInTheDocument();

      const allInputElements = screen.getAllByRole('testRole');
      expect(allInputElements.length).toBeGreaterThanOrEqual(7);

      const p1Element2 = screen.getByText('Firstname', { selector: 'p' });
      expect(p1Element2).toBeInTheDocument();

      const p2Element = screen.getByText('Lastname', { selector: 'p' });
      expect(p2Element).toBeInTheDocument();

      const p3Element = screen.getByText('Email', { selector: 'p' });
      expect(p3Element).toBeInTheDocument();

      const p4Element = screen.getByText('Gender', { selector: 'p' });
      expect(p4Element).toBeInTheDocument();

      const p5Element = screen.getByText('Contact No', { selector: 'p' });
      expect(p5Element).toBeInTheDocument();

      const testSaveChangesBtn = screen.getByRole('testSaveChangesBtn');
      expect(testSaveChangesBtn).toBeInTheDocument();

      const testChangeImageBtn = screen.getByRole('testChangeImageBtn');
      expect(testChangeImageBtn).toBeInTheDocument();

      const h2TitleElement3 = screen.getByText('Two factor authentication', { selector: 'h2' });
      expect(h2TitleElement3).toBeInTheDocument();

      const h1TitleElement2 = screen.getByText('Settings', { selector: 'h1' });
      expect(h1TitleElement2).toBeInTheDocument();
    });
  });

  it('should render DashboardAccount Component', async () => {
    mockAxios.onGet(`${import.meta.env.VITE_APP_API_URL}/user/profile`).reply(200, {
      status: 'success',
      data: {
        code: 200,
        message: 'Profile fetched successfully',
        profile: {
          id: '11ad3b04-35e7-4702-974b-e92dd52b3e56',
          firstName: 'joe',
          lastName: 'store',
          email: 'test@gmail.com',
          gender: 'Male',
          phoneNumber: '0789412421',
          photoUrl: 'https://via.placeholder.com/150',
          verified: true,
          status: 'active',
          userType: 'Vendor',
          twoFactorEnabled: false,
          role: 'VENDOR',
          createdAt: '2024-07-03T09:05:09.447Z',
          updatedAt: '2024-07-18T19:01:07.295Z',
          accountBalance: '0.00'
        }
      }
    });

    render(
      <Provider store={store}>
        <DashboardAccount />
      </Provider>
    );

    await waitFor(() => {
      const img1 = screen.getByRole('profileTest');
      expect(img1).toBeInTheDocument();

      const checkBoxInputElement = screen.getByTestId('toggle');
      expect(checkBoxInputElement).toBeInTheDocument();
      expect(checkBoxInputElement).not.toBeChecked();
    });
  });

  it('should render DashboardAccount Component', async () => {
    mockAxios.onPut(`${import.meta.env.VITE_APP_API_URL}/user/update`).reply(200, {
      status: 'success',
      data: {
        code: 200,
        message: 'Profile updated successfully',
        profile: {
          id: '11ad3b04-35e7-4702-974b-e92dd52b3e56',
          firstName: 'joe',
          lastName: 'store',
          email: 'test@gmail.com',
          gender: 'Male',
          phoneNumber: '0789412421',
          photoUrl: 'https://via.placeholder.com/150',
          verified: true,
          status: 'active',
          userType: 'Vendor',
          twoFactorEnabled: true,
          role: 'VENDOR',
          createdAt: '2024-07-03T09:05:09.447Z',
          updatedAt: '2024-07-18T19:01:07.295Z',
          accountBalance: '0.00'
        }
      }
    });

    render(
      <Provider store={store}>
        <DashboardAccount />
        <Toaster position="top-center" reverseOrder={false} />;
      </Provider>
    );

    await waitFor(() => {
      const img1 = screen.getByRole('profileTest');
      expect(img1).toBeInTheDocument();
    });

    const testSaveChangesBtn = screen.getByRole('testSaveChangesBtn');
    expect(testSaveChangesBtn).toBeInTheDocument();

    fireEvent.click(testSaveChangesBtn);

    await waitFor(() => {
      const successToast = screen.getByText('Profile updated successfully');
      expect(successToast).toBeInTheDocument();

      const checkBoxInputElement = screen.getByTestId('toggle');
      expect(checkBoxInputElement).toBeInTheDocument();
      expect(checkBoxInputElement).toBeChecked();
    });
  });

  it('should render DashboardAccount Component', async () => {
    mockAxios.onPut(`${import.meta.env.VITE_APP_API_URL}/user/update`).reply(400, {
      status: 'success',
      code: 400,
      message: 'Some error occured'
    });

    render(
      <Provider store={store}>
        <DashboardAccount />
        <Toaster position="top-center" reverseOrder={false} />;
      </Provider>
    );

    await waitFor(() => {
      const img1 = screen.getByRole('profileTest');
      expect(img1).toBeInTheDocument();
    });

    const testSaveChangesBtn = screen.getByRole('testSaveChangesBtn');
    expect(testSaveChangesBtn).toBeInTheDocument();

    fireEvent.click(testSaveChangesBtn);

    await waitFor(() => {
      const successToast = screen.getAllByText('Something went wrong, please try again.');
      expect(successToast.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should render DashboardAccount Component', async () => {
    mockAxios.onPut(`${import.meta.env.VITE_APP_API_URL}/user/profile`).reply(400, {
      status: 'success',
      code: 400,
      message: 'Please upload an image'
    });

    render(
      <Provider store={store}>
        <DashboardAccount />
        <Toaster position="top-center" reverseOrder={false} />;
      </Provider>
    );

    await waitFor(() => {
      const img1 = screen.getByRole('profileTest');
      expect(img1).toBeInTheDocument();
    });

    const testChangeImageBtn = screen.getByRole('testChangeImageBtn');
    expect(testChangeImageBtn).toBeInTheDocument();

    fireEvent.click(testChangeImageBtn);

    await waitFor(() => {
      const errorToast = screen.getAllByText('Please upload an image');
      expect(errorToast.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should render DashboardAccount Component', async () => {
    mockAxios.onPut(`${import.meta.env.VITE_APP_API_URL}/user/profile`).reply(200, {
      status: 'success',
      data: {
        code: 200,
        message: 'Profile picture updated successfully',
        profile: {
          id: '11ad3b04-35e7-4702-974b-e92dd52b3e56',
          firstName: 'joe',
          lastName: 'store',
          email: 'test@gmail.com',
          gender: 'Male',
          phoneNumber: '0789412421',
          photoUrl: 'https://via.placeholder.com/150',
          verified: true,
          status: 'active',
          userType: 'Vendor',
          twoFactorEnabled: true,
          role: 'VENDOR',
          createdAt: '2024-07-03T09:05:09.447Z',
          updatedAt: '2024-07-18T19:01:07.295Z',
          accountBalance: '0.00'
        }
      }
    });

    render(
      <Provider store={store}>
        <DashboardAccount />
        <Toaster position="top-center" reverseOrder={false} />;
      </Provider>
    );

    await waitFor(() => {
      const img1 = screen.getByRole('profileTest');
      expect(img1).toBeInTheDocument();
    });

    const testChangeImageBtn = screen.getByRole('testChangeImageBtn');
    expect(testChangeImageBtn).toBeInTheDocument();

    fireEvent.click(testChangeImageBtn);

    await waitFor(() => {
      const successToast = screen.getAllByText('Profile picture updated successfully');
      expect(successToast.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should render DashboardAccount Component', async () => {
    mockAxios.onPost(`${import.meta.env.VITE_APP_API_URL}/user/disable-2fa`).reply(200, {
      status: 'success',
      data: {
        code: 200,
        message: '2fa disabled successfully',
        profile: {
          id: '11ad3b04-35e7-4702-974b-e92dd52b3e56',
          firstName: 'joe',
          lastName: 'store',
          email: 'test@gmail.com',
          gender: 'Male',
          phoneNumber: '0789412421',
          photoUrl: 'https://via.placeholder.com/150',
          verified: true,
          status: 'active',
          userType: 'Vendor',
          twoFactorEnabled: false,
          role: 'VENDOR',
          createdAt: '2024-07-03T09:05:09.447Z',
          updatedAt: '2024-07-18T19:01:07.295Z',
          accountBalance: '0.00'
        }
      }
    });

    render(
      <Provider store={store}>
        <DashboardAccount />
        <Toaster position="top-center" reverseOrder={false} />;
      </Provider>
    );

    await waitFor(() => {
      const img1 = screen.getByRole('profileTest');
      expect(img1).toBeInTheDocument();
    });

    const checkBoxInputElement = screen.getByTestId('toggle');
    expect(checkBoxInputElement).toBeInTheDocument();

    fireEvent.click(checkBoxInputElement);

    await waitFor(() => {
      const successToast = screen.getAllByText('2fa disabled successfully');
      expect(successToast.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should render DashboardAccount Component', async () => {
    mockAxios.onPost(`${import.meta.env.VITE_APP_API_URL}/user/enable-2fa`).reply(200, {
      status: 'success',
      data: {
        code: 200,
        message: '2fa enabled successfully',
        profile: {
          id: '11ad3b04-35e7-4702-974b-e92dd52b3e56',
          firstName: 'joe',
          lastName: 'store',
          email: 'test@gmail.com',
          gender: 'Male',
          phoneNumber: '0789412421',
          photoUrl: 'https://via.placeholder.com/150',
          verified: true,
          status: 'active',
          userType: 'Vendor',
          twoFactorEnabled: true,
          role: 'VENDOR',
          createdAt: '2024-07-03T09:05:09.447Z',
          updatedAt: '2024-07-18T19:01:07.295Z',
          accountBalance: '0.00'
        }
      }
    });

    render(
      <Provider store={store}>
        <DashboardAccount />
        <Toaster position="top-center" reverseOrder={false} />;
      </Provider>
    );

    await waitFor(() => {
      const img1 = screen.getByRole('profileTest');
      expect(img1).toBeInTheDocument();
    });

    const checkBoxInputElement = screen.getByTestId('toggle');
    expect(checkBoxInputElement).toBeInTheDocument();

    fireEvent.click(checkBoxInputElement);

    await waitFor(() => {
      const successToast = screen.getAllByText('2fa enabled successfully');
      expect(successToast.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should render DashboardAccount Component', async () => {
    mockAxios.onPost(`${import.meta.env.VITE_APP_API_URL}/user/disable-2fa`).reply(400, {
      status: 'error',
      message: 'something went wrong',
      code: 400
    });

    render(
      <Provider store={store}>
        <DashboardAccount />
        <Toaster position="top-center" reverseOrder={false} />;
      </Provider>
    );

    await waitFor(() => {
      const img1 = screen.getByRole('profileTest');
      expect(img1).toBeInTheDocument();
    });

    const checkBoxInputElement = screen.getByTestId('toggle');
    expect(checkBoxInputElement).toBeInTheDocument();

    fireEvent.click(checkBoxInputElement);

    await waitFor(() => {
      const successToast = screen.getAllByText('Something went wrong, please try again.');
      expect(successToast.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should render DashboardAccount Component', async () => {
    mockAxios.onPost(`${import.meta.env.VITE_APP_API_URL}/user/enable-2fa`).reply(400, {
      status: 'error',
      message: 'something went wrong',
      code: 400
    });

    render(
      <Provider store={store}>
        <DashboardAccount />
        <Toaster position="top-center" reverseOrder={false} />;
      </Provider>
    );

    await waitFor(() => {
      const img1 = screen.getByRole('profileTest');
      expect(img1).toBeInTheDocument();
    });

    const checkBoxInputElement = screen.getByTestId('toggle');
    expect(checkBoxInputElement).toBeInTheDocument();

    fireEvent.click(checkBoxInputElement);

    await waitFor(() => {
      const successToast = screen.getAllByText('Something went wrong, please try again.');
      expect(successToast.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should render DashboardAccount Component on buyer side', async () => {
    store.dispatch(setCredentials(buyerTestToken));
    mockAxios.onGet(`${import.meta.env.VITE_APP_API_URL}/user/profile`).reply(200, {
      status: 'success',
      data: {
        code: 200,
        message: 'Profile fetched successfully',
        profile: {
          id: '11ad3b04-35e7-4702-974b-e92dd52b3e56',
          firstName: 'joe',
          lastName: 'store',
          email: 'test@gmail.com',
          gender: 'Male',
          phoneNumber: '0789412421',
          photoUrl: null,
          verified: true,
          status: 'active',
          userType: 'Buyer',
          twoFactorEnabled: false,
          role: 'BUYER',
          createdAt: '2024-07-03T09:05:09.447Z',
          updatedAt: '2024-07-18T19:01:07.295Z',
          accountBalance: '0.00'
        }
      }
    });

    render(
      <Provider store={store}>
        <DashboardAccount />
      </Provider>
    );

    await waitFor(() => {
      const h2TitleElement = screen.getByText('Profile Information', { selector: 'h1' });
      expect(h2TitleElement).toBeInTheDocument();

      const img1 = screen.getByRole('profileTest');
      expect(img1).toBeInTheDocument();

      const img2 = screen.getByRole('uploadIcon');
      expect(img2).toBeInTheDocument();

      const h2TitleElement2 = screen.getByText('Basic Info', { selector: 'h2' });
      expect(h2TitleElement2).toBeInTheDocument();

      const spanElement1 = screen.getByText('Status', { selector: 'span' });
      expect(spanElement1).toBeInTheDocument();

      const spanElement3 = screen.getByText('Member since', { selector: 'span' });
      expect(spanElement3).toBeInTheDocument();

      const spanElement4 = screen.getByText('Role', { selector: 'span' });
      expect(spanElement4).toBeInTheDocument();

      const spanElement5 = screen.getByText('Buyer', { selector: 'span' });
      expect(spanElement5).toBeInTheDocument();

      const spanElement6 = screen.getByText('03 Jul 2024', { selector: 'span' });
      expect(spanElement6).toBeInTheDocument();

      const spanElement7 = screen.getByText('No file choosen', { selector: 'span' });
      expect(spanElement7).toBeInTheDocument();

      const allInputElements = screen.getAllByRole('testRole');
      expect(allInputElements.length).toBeGreaterThanOrEqual(6);

      const p1Element2 = screen.getByText('Firstname', { selector: 'p' });
      expect(p1Element2).toBeInTheDocument();

      const p2Element = screen.getByText('Lastname', { selector: 'p' });
      expect(p2Element).toBeInTheDocument();

      const p3Element = screen.getByText('Email', { selector: 'p' });
      expect(p3Element).toBeInTheDocument();

      const p4Element = screen.getByText('Gender', { selector: 'p' });
      expect(p4Element).toBeInTheDocument();

      const p5Element = screen.getByText('Contact No', { selector: 'p' });
      expect(p5Element).toBeInTheDocument();

      const testSaveChangesBtn = screen.getByRole('testSaveChangesBtn');
      expect(testSaveChangesBtn).toBeInTheDocument();

      const testChangeImageBtn = screen.getByRole('testChangeImageBtn');
      expect(testChangeImageBtn).toBeInTheDocument();
    });
  });
});
