import React from 'react';
import { it, expect, describe, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SingleUser from '../../../components/Dashboard/adminDashbord/SingleUser';
import store from '../../../redux/store';
import { Provider } from 'react-redux';
import axios from 'axios';
import { deactivateUser } from '../../../utils/updateUserStatus/deactivateUser';
import { activateUser } from '../../../utils/updateUserStatus/activateUser';
import { MemoryRouter, useNavigate } from 'react-router-dom';

vi.mock('axios');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});
vi.mock('../../../utils/updateUserStatus/deactivateUser');
vi.mock('../../../utils/updateUserStatus/activateUser');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedUser = {
  createdAt: '2024-05-12T22:59:46.868Z',
  email: 'user1@gmail.com',
  firstName: 'Test',
  lastName: 'User1',
  gender: 'male',
  id: '1a2b3c4d5e6f7g8h9i0j',
  phoneNumber: '1234567890',
  photoUrl: null,
  role: 'BUYER',
  status: 'active',
  twoFactorEnabled: false,
  updatedAt: '2024-07-11T15:27:10.831Z',
  userType: 'Buyer',
  verified: true
};

const mockedResponse = {
  status: 200,
  data: {
    user: mockedUser
  }
};

describe('single user page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleUser />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render single page properly without crashing', async () => {
    const navigate = useNavigate();

    const UsersText = screen.getByText('Users');
    expect(UsersText).toBeInTheDocument();
    fireEvent.click(UsersText);
    expect(navigate).toHaveBeenCalledWith('/Admin/dashboard/users');

    await waitFor(() => {
      const username = screen.getByTestId('userIdentifier');
      expect(username).toHaveTextContent(`#${mockedUser.firstName.toLowerCase() + mockedUser.lastName.toLowerCase()}`);
    });
  });
});

describe('Checking user properties for active user', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedAxios.get.mockResolvedValueOnce(mockedResponse);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleUser />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should tell if no profile picture', async () => {
    await waitFor(() => {
      const profileImageDiv = screen.getByTestId('profileIdentifier');
      expect(profileImageDiv).toHaveTextContent(/No profile picture/i);
    });
  });

  it('should tell if the user has a profile picture', async () => {
    const imageUrl = 'https://example.com/profile.jpg';
    const mockedUserWithImage = { ...mockedUser, photoUrl: imageUrl };
    const mockedResponsewithImage = { status: 200, data: { user: mockedUserWithImage } };
    mockedAxios.get.mockResolvedValueOnce(mockedResponsewithImage);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleUser />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      const profileImage = screen.getByRole('img', { name: /user profile/i });
      expect(profileImage).toHaveAttribute('src', imageUrl);
    });
  });

  it('should deal with deactivating user collectly and render well when is has not enabled 2FA', async () => {
    await waitFor(async () => {
      const deactivateStatusButton = screen.getByTestId('deactivateStatusButton');
      const userStatusDiv = screen.getByTestId('statusIdentifier');
      const twoFAStatusDiv = screen.getByTestId('2FAIdentifier');

      expect(userStatusDiv).toHaveTextContent('Active');
      expect(twoFAStatusDiv).toHaveTextContent('Disbled');
      expect(deactivateStatusButton).toBeInTheDocument();
      expect(deactivateStatusButton).toHaveTextContent('Deactivate');

      fireEvent.click(deactivateStatusButton);
      const acceptButton = screen.getByTestId('accept');
      fireEvent.click(acceptButton);
      expect(deactivateUser).toHaveBeenCalled();
    });
  });
});

describe('Checking user properties for inactive user', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it('should deal with activating user collectly and render well when is has enabled 2FA', async () => {
    const updatedUser = { ...mockedUser, status: 'suspended', twoFactorEnabled: true };
    const mockedResponsewithImage = { status: 200, data: { user: updatedUser } };
    mockedAxios.get.mockResolvedValueOnce(mockedResponsewithImage);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SingleUser />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(async () => {
      const activateStatusButton = screen.getByTestId('activateStatusButton');
      const userStatusDiv = screen.getByTestId('statusIdentifier');
      const twoFAStatusDiv = screen.getByTestId('2FAIdentifier');

      expect(userStatusDiv).toHaveTextContent('Suspended');
      expect(twoFAStatusDiv).toHaveTextContent('Enabled');
      expect(activateStatusButton).toBeInTheDocument();
      expect(activateStatusButton).toHaveTextContent('Activate');

      fireEvent.click(activateStatusButton);
      const acceptButton = screen.getByTestId('accept');
      fireEvent.click(acceptButton);
      expect(activateUser).toHaveBeenCalled();
    });
  });
});
