import React, { useEffect, useState } from 'react';
import { useJwt } from 'react-jwt';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setAllNotifications, setUnreadNotification } from '../../redux/reducers/notification';
import Notification from './Notification';
import { io } from 'socket.io-client';
import { DecodedToken } from '../../pages/Authentication/Login';
import { NotificationProps } from './OneNotification';
import axios from 'axios';
import notificaticationBellSound from './assets/audios/mixkit-achievement-bell-600.wav';

interface notifications {
  allNotifications: NotificationProps[];
  createdAt?: Date;
  id: string;
  unRead: string | number;
  updatedAt?: Date;
}

interface notificationMessage {
  action: string;
  sound?: boolean;
  notifications: notifications;
}

function NotificationLayout() {
  const { userToken } = useSelector((state: RootState) => state.auth);
  const { openNotification, unreadNotifications, allNotifications } = useSelector(
    (state: RootState) => state.notification
  );
  const { decodedToken } = useJwt<DecodedToken>(userToken);
  const socketUrl = import.meta.env.VITE_APP_API_URL;
  const [loading, setLoading] = useState(true);

  const sortedNotifications = (notifications: NotificationProps[]) => {
    return notifications.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const email = decodedToken?.email;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/notification/`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        if (response.status === 200) {
          if (response.data.data.message === "User doesn't have any notifications.") {
            setLoading(false);
            dispatch(setAllNotifications([]));
            dispatch(setUnreadNotification(0));
            return;
          }
          const notifications = response.data.data;

          const sorted = sortedNotifications(notifications.notificationDetails.notifications);

          dispatch(setAllNotifications(sorted));
          dispatch(setUnreadNotification(notifications.notificationDetails.unRead));
        }
        setLoading(false);
      } catch (error) {
        console.log('Failed to fetch notifications');
      }
    };
    userToken && fetchData();
  }, [userToken, dispatch]);

  useEffect(() => {
    let unread: number = 0;
    allNotifications.forEach((notification) => {
      if (notification.isRead === false) {
        unread += 1;
      }
    });
    dispatch(setUnreadNotification(unread));
  }, [allNotifications, dispatch]);

  useEffect(() => {
    const socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('Socket.IO Connection established');
    });

    socket.on('notification', (message: notificationMessage) => {
      if (message.action === `${email} notification`) {
        dispatch(setAllNotifications(sortedNotifications(message.notifications.allNotifications)));
        dispatch(setUnreadNotification(message.notifications.unRead));
        if (message.sound === true) {
          playNotificationSound();
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO connection closed');
    });

    return () => {
      socket.disconnect();
    };
  }, [socketUrl, email, dispatch, unreadNotifications]);

  return <div>{!loading && openNotification && <Notification />}</div>;
}

const playNotificationSound = () => {
  const audio = new Audio(notificaticationBellSound);
  audio.volume = 0.2;
  audio.play().catch((error) => console.error('Error playing sound:', error));
};

export default NotificationLayout;
