import React from 'react';
import { it, expect, describe } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Users from '../../../components/Dashboard/adminDashbord/Users';
import store from '../../../redux/store';
import { Provider } from 'react-redux';
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { numberOfUsers } from '../../../components/Dashboard/adminDashbord/Users';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Dashbord user page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedAxios.get.mockResolvedValueOnce({ data: { users: [] } });
  });

  it('should render user page without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      </Provider>
    );

    const allUsersText = screen.getByRole('heading', { name: /All Users/i });
    const vendorText = screen.getByText('Total Vendors');
    const buyerText = screen.getByText('Total Buyers');
    expect(allUsersText).toBeInTheDocument();
    expect(vendorText).toBeInTheDocument();
    expect(buyerText).toBeInTheDocument();
  });

  it('should tell when therte are no users', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const noUserText = screen.getByText(/No user/i);
      expect(noUserText).toBeInTheDocument();
      const activeVendors = screen.getByTestId('activeVendors');
      const inactiveVendors = screen.getByTestId('inactiveVendors');
      const activeBuyers = screen.getByTestId('activeBuyers');
      const inactiveBuyers = screen.getByTestId('inactiveBuyers');
      const totalvendors = screen.getByTestId('totalVendors');
      const totalBuyers = screen.getByTestId('totalBuyers');

      expect(activeVendors).toHaveTextContent('Active: 0');
      expect(inactiveVendors).toHaveTextContent('Inactive: 0');
      expect(activeBuyers).toHaveTextContent('Active: 0');
      expect(inactiveBuyers).toHaveTextContent('Inactive: 0');
      expect(totalvendors).toHaveTextContent('0');
      expect(totalBuyers).toHaveTextContent('0');
    });
  });
});

describe('It should work properly when there are user', () => {
  const mockedUserResponse = {
    status: 200,
    data: {
      users: [
        {
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
        },
        {
          createdAt: '2024-05-13T15:35:31.217Z',
          email: 'user2@gmail.com',
          firstName: 'Test',
          lastName: 'User2',
          gender: 'female',
          id: '1a2b3c4d5e6f7g8h9i0k',
          phoneNumber: '0987654321',
          photoUrl: null,
          role: 'BUYER',
          status: 'suspended',
          twoFactorEnabled: false,
          updatedAt: '2024-07-11T20:53:13.595Z',
          userType: 'Buyer',
          verified: true
        },
        {
          createdAt: '2024-05-14T10:20:40.111Z',
          email: 'user3@gmail.com',
          firstName: 'Test',
          lastName: 'User3',
          gender: 'male',
          id: '1a2b3c4d5e6f7g8h9i0l',
          phoneNumber: '1122334455',
          photoUrl: null,
          role: 'BUYER',
          status: 'active',
          twoFactorEnabled: true,
          updatedAt: '2024-07-11T18:15:22.222Z',
          userType: 'Buyer',
          verified: false
        },
        {
          createdAt: '2024-05-15T12:40:50.555Z',
          email: 'user4@gmail.com',
          firstName: 'Test',
          lastName: 'User4',
          gender: 'female',
          id: '1a2b3c4d5e6f7g8h9i0m',
          phoneNumber: '5566778899',
          photoUrl: null,
          role: 'VENDOR',
          status: 'active',
          twoFactorEnabled: false,
          updatedAt: '2024-07-11T19:35:33.333Z',
          userType: 'Vendor',
          verified: true
        },
        {
          createdAt: '2024-05-16T14:50:60.888Z',
          email: 'user5@gmail.com',
          firstName: 'Test',
          lastName: 'User5',
          gender: 'male',
          id: '1a2b3c4d5e6f7g8h9i0n',
          phoneNumber: '6677889900',
          photoUrl: null,
          role: 'BUYER',
          status: 'suspended',
          twoFactorEnabled: true,
          updatedAt: '2024-07-11T21:47:44.444Z',
          userType: 'Buyer',
          verified: false
        },
        {
          createdAt: '2024-05-17T16:00:70.777Z',
          email: 'user6@gmail.com',
          firstName: 'Test',
          lastName: 'User6',
          gender: 'female',
          id: '1a2b3c4d5e6f7g8h9i0o',
          phoneNumber: '7788990011',
          photoUrl: null,
          role: 'VENDOR',
          status: 'active',
          twoFactorEnabled: false,
          updatedAt: '2024-07-11T22:58:55.555Z',
          userType: 'Buyer',
          verified: true
        },
        {
          createdAt: '2024-05-18T18:10:80.666Z',
          email: 'user7@gmail.com',
          firstName: 'Test',
          lastName: 'User7',
          gender: 'male',
          id: '1a2b3c4d5e6f7g8h9i0p',
          phoneNumber: '8899001122',
          photoUrl: null,
          role: 'BUYER',
          status: 'active',
          twoFactorEnabled: true,
          updatedAt: '2024-07-11T23:59:66.666Z',
          userType: 'Buyer',
          verified: false
        },
        {
          createdAt: '2024-05-19T20:20:90.555Z',
          email: 'user8@gmail.com',
          firstName: 'Test',
          lastName: 'User8',
          gender: 'female',
          id: '1a2b3c4d5e6f7g8h9i0q',
          phoneNumber: '9900112233',
          photoUrl: null,
          role: 'VENDOR',
          status: 'suspended',
          twoFactorEnabled: false,
          updatedAt: '2024-07-11T24:10:77.777Z',
          userType: 'Buyer',
          verified: true
        },
        {
          createdAt: '2024-05-20T22:30:10.444Z',
          email: 'user9@gmail.com',
          firstName: 'Test',
          lastName: 'User9',
          gender: 'male',
          id: '1a2b3c4d5e6f7g8h9i0r',
          phoneNumber: '0011223344',
          photoUrl: null,
          role: 'BUYER',
          status: 'active',
          twoFactorEnabled: true,
          updatedAt: '2024-07-11T25:20:88.888Z',
          userType: 'Buyer',
          verified: false
        },
        {
          createdAt: '2024-05-21T24:40:20.333Z',
          email: 'user10@gmail.com',
          firstName: 'Test',
          lastName: 'User10',
          gender: 'female',
          id: '1a2b3c4d5e6f7g8h9i0s',
          phoneNumber: '2233445566',
          photoUrl: null,
          role: 'VENDOR',
          status: 'active',
          twoFactorEnabled: false,
          updatedAt: '2024-07-11T26:30:99.999Z',
          userType: 'Buyer',
          verified: true
        },
        {
          createdAt: '2024-05-22T26:50:30.222Z',
          email: 'user11@gmail.com',
          firstName: 'Test',
          lastName: 'User11',
          gender: 'male',
          id: '1a2b3c4d5e6f7g8h9i0t',
          phoneNumber: '3344556677',
          photoUrl: null,
          role: 'BUYER',
          status: 'active',
          twoFactorEnabled: true,
          updatedAt: '2024-07-11T27:40:10.111Z',
          userType: 'Buyer',
          verified: false
        },
        {
          createdAt: '2024-05-23T28:00:40.111Z',
          email: 'user12@gmail.com',
          firstName: 'Test',
          lastName: 'User12',
          gender: 'female',
          id: '1a2b3c4d5e6f7g8h9i0u',
          phoneNumber: '4455667788',
          photoUrl: null,
          role: 'VENDOR',
          status: 'active',
          twoFactorEnabled: false,
          updatedAt: '2024-07-11T28:50:20.222Z',
          userType: 'Buyer',
          verified: true
        }
      ]
    }
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockedAxios.get.mockResolvedValueOnce(mockedUserResponse);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should calculate active and inactive users', async () => {
    await waitFor(() => {
      const activeVendors = screen.getByTestId('activeVendors');
      const inactiveVendors = screen.getByTestId('inactiveVendors');
      const activeBuyers = screen.getByTestId('activeBuyers');
      const inactiveBuyers = screen.getByTestId('inactiveBuyers');
      const totalvendors = screen.getByTestId('totalVendors');
      const totalBuyers = screen.getByTestId('totalBuyers');

      expect(activeVendors).toHaveTextContent('Active: 4');
      expect(inactiveVendors).toHaveTextContent('Inactive: 1');
      expect(activeBuyers).toHaveTextContent('Active: 5');
      expect(inactiveBuyers).toHaveTextContent('Inactive: 2');
      expect(totalvendors).toHaveTextContent('5');
      expect(totalBuyers).toHaveTextContent('7');
    });
  });

  it('should render properly the table of users according to the page', async () => {
    await waitFor(() => {
      const userPropsTable = screen.getByTestId('userPropsTable');
      expect(userPropsTable).toBeInTheDocument();

      const userDivs = screen.getAllByTestId('userDiv');
      const navigate = useNavigate();

      for (let i = 0; i < numberOfUsers; i++) {
        const emailRegex = new RegExp(mockedUserResponse.data.users[i].email, 'i');
        const userDiv = userDivs.find((div) => div.textContent?.match(emailRegex));
        expect(userDiv).toBeInTheDocument();

        if (userDiv) {
          fireEvent.click(userDiv);
          expect(navigate).toHaveBeenCalledWith(`/Admin/dashboard/users/${mockedUserResponse.data.users[i].id}`);
        }
      }
    });
  });
});

describe('It should work properly when searching users', () => {
  const mockedUserResponse = {
    status: 200,
    data: {
      users: [
        {
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
        },
        {
          createdAt: '2024-05-13T15:35:31.217Z',
          email: 'user2@gmail.com',
          firstName: 'Test',
          lastName: 'User2',
          gender: 'female',
          id: '1a2b3c4d5e6f7g8h9i0k',
          phoneNumber: '0987654321',
          photoUrl: null,
          role: 'BUYER',
          status: 'suspended',
          twoFactorEnabled: false,
          updatedAt: '2024-07-11T20:53:13.595Z',
          userType: 'Buyer',
          verified: true
        }
      ]
    }
  };

  beforeEach(() => {
    vi.resetAllMocks();
    mockedAxios.get.mockResolvedValueOnce(mockedUserResponse);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should be able to search user by name or email', async () => {
    await waitFor(() => {
      const textInput = screen.getByPlaceholderText(/Search by Name, Email/);
      expect(textInput).toBeInTheDocument;

      const UserDivs = screen.getAllByTestId('userDiv');

      //searching by email
      fireEvent.change(textInput, { target: { value: mockedUserResponse.data.users[0].email } });
      expect(UserDivs.length).toBe(1);
      expect(UserDivs[0]).toHaveTextContent(mockedUserResponse.data.users[0].email);

      //searching by name
      fireEvent.change(textInput, {
        target: { value: mockedUserResponse.data.users[1].firstName }
      });
      expect(UserDivs.length).toBe(1);
      expect(UserDivs[0]).toHaveTextContent(mockedUserResponse.data.users[1].firstName);
    });
  });
});
