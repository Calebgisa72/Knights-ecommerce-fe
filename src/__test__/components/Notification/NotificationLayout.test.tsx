import React from 'react';
import { it, expect, describe, vi } from 'vitest';
import NotificationLayout from '../../../components/Notification/NotificationLayout';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { setCredentials } from '../../../redux/reducers/authReducer';

vi.mock('axios');
vi.mock('../../utils/errorHandler');
const userToken = 'mockToken';

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNotifications = [
  {
    id: '1',
    content: 'Test notification 1',
    type: 'info',
    isRead: false,
    createdAt: '2024-07-21T10:30:29.976Z'
  },
  {
    id: '2',
    content: 'Test notification 2',
    type: 'product',
    isRead: true,
    createdAt: '2024-05-21T10:30:29.976Z'
  },
  {
    id: '3',
    content: 'Test notification 3',
    type: 'alert',
    isRead: false,
    createdAt: '2024-09-21T10:30:29.976Z'
  }
];

const mockedNotificationResponse = {
  status: 200,
  data: {
    message: '',
    data: {
      notificationDetails: {
        notifications: mockNotifications,
        unRead: 2
      }
    }
  }
};

const mockedNoNotificationResponse = {
  status: 200,
  data: {
    message: "User doesn't have any notifications.",
    data: {
      notificationDetails: {}
    }
  }
};

describe('Notification layout tests', () => {
  beforeEach(() => {
    store.dispatch(setCredentials(userToken));
    vi.resetAllMocks();
  });

  it('should handle no notifications case', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockedNoNotificationResponse);

    render(
      <BrowserRouter>
        <Provider store={store}>
          <NotificationLayout />
        </Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const state = store.getState();
      expect(state.notification.allNotifications).toEqual([]);
      expect(state.notification.unreadNotifications).toBe(0);
    });
  });

  it('should fetch notifications correctly on load', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockedNotificationResponse);

    render(
      <BrowserRouter>
        <Provider store={store}>
          <NotificationLayout />
        </Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const state = store.getState();
      expect(state.notification.allNotifications).toEqual(mockNotifications);
      expect(state.notification.unreadNotifications).toBe(2);
    });
  });
});
