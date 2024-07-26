import React, { useEffect, useState } from 'react';
import {
  setOpenNotification,
  setSelectedNotificationsIds,
  setAllNotifications
} from '../../redux/reducers/notification';
import { useDispatch, useSelector } from 'react-redux';
import OneNotification from './OneNotification';
import { RootState } from '../../redux/store';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getConfig } from '../../redux/actions/cartAction';
import { deleteNotifications } from '../../utils/notificationsFunctios/deleteNotifications';

function Notification() {
  const { userToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { allNotifications, selectedNotificationsIds } = useSelector((state: RootState) => state.notification);
  const [notificationDivs, setNotificationDivs] = useState<JSX.Element[]>([]);
  const notificationIds: string[] = [];
  const config = getConfig();

  const handleNotificationPopup = () => {
    dispatch(setOpenNotification(false));
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    if (checked) {
      allNotifications.forEach((notification) => {
        notificationIds.push(notification.id);
      });
      dispatch(setSelectedNotificationsIds(notificationIds));
    } else if (!checked) {
      dispatch(setSelectedNotificationsIds([]));
    }
  };

  const handleDeletingNotifications = () => {
    if (selectedNotificationsIds.length === 0) {
      toast.error('Please select notifications to delete before deleting');
    } else {
      const updatedNotifications = allNotifications.filter((notification) => {
        return !selectedNotificationsIds.includes(notification.id);
      });
      dispatch(setAllNotifications(updatedNotifications));
      deleteNotifications(userToken, selectedNotificationsIds);
      dispatch(setSelectedNotificationsIds([]));
    }
  };

  const updateSelectedNotifications = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (selectedNotificationsIds.length > 0) {
      const updatedNotifications = allNotifications.map((notification) => {
        if (selectedNotificationsIds.includes(notification.id)) {
          return { ...notification, isRead: true };
        } else {
          return notification;
        }
      });
      dispatch(setAllNotifications(updatedNotifications));
      try {
        const updateSelectedNotifications = await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/notification`,
          { notificationIds: selectedNotificationsIds },
          config
        );

        if (updateSelectedNotifications.data.status === 'success') {
          toast.success('Selected notifications marked as read');
        } else {
          toast.error('Failed to update selected notifications');
        }
      } catch (error) {
        console.log('Failed to update selected notifications', error);
        toast.error('Failed to update selected notifications');
      }
      dispatch(setSelectedNotificationsIds([]));
    } else {
      toast.error('No notifications selected');
    }
  };

  useEffect(() => {
    const notificaionJSX: JSX.Element[] = [];
    allNotifications.forEach((notification, index) => {
      notificaionJSX.push(<OneNotification noficationProp={notification} key={index} />);
    });
    setNotificationDivs(notificaionJSX);
  }, [allNotifications]);

  return (
    <div className="fixed animate-slideInFromTop inset-0 z-40 flex pt-[60px] xmd:pt-[30px] px-6 xmd:px-16 md:px-36 lg:px-48 items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
      <div className="bg-white h-[550px] w-full p-8 pb-2 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="text-[18px] font-bold">Notification</div>
          <div onClick={handleNotificationPopup} className="text-[25px] font-medium cursor-pointer">
            X
          </div>
        </div>

        {notificationDivs.length > 0 && (
          <div className="flex gap-3 items-center px-4">
            <input
              style={{ height: '1.2rem', width: '1.2rem', cursor: 'pointer' }}
              type="checkbox"
              id="selectAll"
              checked={allNotifications.length === selectedNotificationsIds.length}
              onChange={handleSelectAll}
              name="selectAll"
            />
            <label className="cursor-pointer" htmlFor="selectAll">
              Select All
            </label>
          </div>
        )}
        <div className="w-full h-full overflow-y-scroll overflow-x-auto">
          <div className="w-[600px] xmd:w-full flex flex-col gap-2">
            {notificationDivs.length > 0 && notificationDivs}
            {notificationDivs.length === 0 && <p className="text-center">You have no notifications</p>}
          </div>
        </div>
        {allNotifications.length > 0 && (
          <div className="py-2 text-[15px] flex flex-col gap-y-2 items-center sm:flex-row justify-between">
            <div onClick={updateSelectedNotifications} className="inline-block hover:underline cursor-pointer">
              Mark all selected as read
            </div>
            <div onClick={handleDeletingNotifications} className="inline-block hover:underline cursor-pointer">
              Clear selected
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;
