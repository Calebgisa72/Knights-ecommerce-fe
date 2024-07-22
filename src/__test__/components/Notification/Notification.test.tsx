import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Notification from '../../../components/Notification/Notification';
import toast from 'react-hot-toast';
import { setSelectedNotificationsIds, setOpenNotification } from '../../../redux/reducers/notification';
import { deleteNotifications } from '../../../utils/notificationsFunctios/deleteNotifications';
import axios from 'axios';

const mockStore = configureStore([]);
vi.mock('axios');
vi.mock('react-hot-toast');
vi.mock('../../../utils/notificationsFunctios/deleteNotifications');
let store: any;

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNotifications = [
  {
    id: '1',
    content: 'Test notification 1',
    type: 'info',
    isRead: false,
    createdAt: new Date()
  },
  {
    id: '2',
    content: 'Test notification 2',
    type: 'alert',
    isRead: true,
    createdAt: new Date()
  }
];

describe('Notification Component', () => {
  beforeEach(() => {
    store = mockStore({
      auth: { userToken: 'testToken' },
      notification: {
        allNotifications: mockNotifications,
        selectedNotificationsIds: [],
        openNotification: true
      }
    });
    vi.resetAllMocks();
  });

  it('renders all notifications', () => {
    render(
      <Provider store={store}>
        <Notification />
      </Provider>
    );

    expect(screen.getByText('Test notification 1')).toBeInTheDocument();
    expect(screen.getByText('Test notification 2')).toBeInTheDocument();
  });

  it('dispatches setSelectedNotificationsIds on select all checkbox change', () => {
    render(
      <Provider store={store}>
        <Notification />
      </Provider>
    );

    const selectAllCheckbox = screen.getAllByRole('checkbox');

    fireEvent.click(selectAllCheckbox[0]);

    const actions = store.getActions();
    expect(actions).toContainEqual(setSelectedNotificationsIds(['1', '2']));
    fireEvent.click(selectAllCheckbox[0]);
    const state = store.getState();
    expect(state.notification.selectedNotificationsIds).toEqual([]);
  });

  it('dispatches setOpenNotification on close button click', () => {
    render(
      <Provider store={store}>
        <Notification />
      </Provider>
    );

    fireEvent.click(screen.getByText('X'));

    const actions = store.getActions();
    expect(actions).toContainEqual(setOpenNotification(false));
  });

  it('shows a message when there are no notifications', () => {
    store = mockStore({
      auth: { userToken: 'testToken' },
      notification: {
        allNotifications: [],
        selectedNotificationsIds: [],
        openNotification: true
      }
    });

    render(
      <Provider store={store}>
        <Notification />
      </Provider>
    );

    expect(screen.getByText('You have no notifications')).toBeInTheDocument();
  });
});

describe('Clearing notifications', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should toast an error when trying to clear no selected notifications', async () => {
    store = mockStore({
      auth: { userToken: 'testToken' },
      notification: {
        allNotifications: mockNotifications,
        selectedNotificationsIds: [],
        openNotification: true
      }
    });
    render(
      <Provider store={store}>
        <Notification />
      </Provider>
    );
    const clearText = screen.getByText(/Clear selected/i);
    fireEvent.click(clearText);
    expect(toast.error).toHaveBeenCalledWith(`Please select notifications to delete before deleting`);

    const markAllText = screen.getByText(/Mark all selected as read/i);
    fireEvent.click(markAllText);
    expect(toast.error).toHaveBeenCalledWith(`No notifications selected`);
  });

  it('should clear successfully selected notifications', async () => {
    store = mockStore({
      auth: { userToken: 'testToken' },
      notification: {
        allNotifications: mockNotifications,
        selectedNotificationsIds: ['id1', 'id2', 'id3'],
        openNotification: true
      }
    });
    render(
      <Provider store={store}>
        <Notification />
      </Provider>
    );
    const clearText = screen.getByText(/Clear selected/i);
    fireEvent.click(clearText);
    expect(deleteNotifications).toHaveBeenCalled();
  });
});

describe('updating notifications', () => {
  beforeEach(() => {
    store = mockStore({
      auth: { userToken: 'testToken' },
      notification: {
        allNotifications: [{ id: 'id1', isRead: false, createdAt: new Date() }],
        selectedNotificationsIds: ['id1', 'id2', 'id3'],
        openNotification: true
      }
    });
  });

  it('should toast success when notifications are updated', async () => {
    store = mockStore({
      auth: { userToken: 'testToken' },
      notification: {
        allNotifications: mockNotifications,
        selectedNotificationsIds: ['id1', 'id2', 'id3'],
        openNotification: true
      }
    });

    render(
      <Provider store={store}>
        <Notification />
      </Provider>
    );

    const mockUpdateResponse = {
      data: {
        status: 'success'
      }
    };
    mockedAxios.put.mockResolvedValueOnce(mockUpdateResponse);

    const updateButton = screen.getByText(/mark all selected as read/i);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${import.meta.env.VITE_APP_API_URL}/notification`,
        { notificationIds: ['id1', 'id2', 'id3'] },
        expect.any(Object)
      );
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Selected notifications marked as read');
      expect(store.getActions()).toContainEqual(setSelectedNotificationsIds([]));
    });
  });

  it('should toast error when update fails', async () => {
    render(
      <Provider store={store}>
        <Notification />
      </Provider>
    );

    mockedAxios.put.mockRejectedValueOnce(new Error('Network Error'));

    const updateButton = screen.getByText(/mark all selected as read/i);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${import.meta.env.VITE_APP_API_URL}/notification`,
        { notificationIds: ['id1', 'id2', 'id3'] },
        expect.any(Object)
      );
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update selected notifications');
    });
  });
});
