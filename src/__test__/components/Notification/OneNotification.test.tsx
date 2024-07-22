import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import OneNotification, { NotificationProps } from '../../../components/Notification/OneNotification';
import { setSelectedNotificationsIds } from '../../../redux/reducers/notification';
import { MemoryRouter } from 'react-router-dom';

const mockStore = configureStore([]);

const mockNotification: NotificationProps = {
  id: '1',
  content: 'Test notification',
  type: 'info',
  isRead: false,
  link: '/some-link',
  createdAt: new Date()
};

describe('OneNotification Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      notification: {
        selectedNotificationsIds: []
      }
    });
  });

  it('renders notification content', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OneNotification noficationProp={mockNotification} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  it('renders notification link', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OneNotification noficationProp={mockNotification} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole('link', { name: 'Test notification' })).toHaveAttribute('href', '/some-link');
  });

  it('checkbox is checked when notification is selected', () => {
    store = mockStore({
      notification: {
        selectedNotificationsIds: ['1']
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OneNotification noficationProp={mockNotification} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('dispatches setSelectedNotificationsIds on checkbox change', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OneNotification noficationProp={mockNotification} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole('checkbox'));

    const actions = store.getActions();
    expect(actions).toContainEqual(setSelectedNotificationsIds(['1']));
  });
});
