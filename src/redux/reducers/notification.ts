import { createSlice } from '@reduxjs/toolkit';
import { NotificationProps } from '../../components/Notification/OneNotification';

interface initialState {
  allNotifications: NotificationProps[];
  unreadNotifications: number;
  selectedNotificationsIds: string[];
  openNotification: boolean;
}

const initialState: initialState = {
  allNotifications: [],
  unreadNotifications: 0,
  selectedNotificationsIds: [],
  openNotification: false
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    setAllNotifications: (state, action) => {
      state.allNotifications = action.payload;
    },
    setSelectedNotificationsIds: (state, action) => {
      state.selectedNotificationsIds = action.payload;
    },
    setUnreadNotification: (state, action) => {
      state.unreadNotifications = action.payload;
    },
    setOpenNotification: (state, action) => {
      state.openNotification = action.payload;
    }
  }
});

export const { setAllNotifications, setUnreadNotification, setSelectedNotificationsIds, setOpenNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
