import axios from 'axios';
import handleError from '../errorHandler';
import toast from 'react-hot-toast';

export async function deleteNotifications(userToken: string, selectedIds: string[]) {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_APP_API_URL}/notification/`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      },
      data: {
        notificationIds: selectedIds
      }
    });

    if (response.status === 200) {
      const numOfDeleted = response.data.data.message.split(' ');
      toast.success(
        `${numOfDeleted[0]} ${numOfDeleted[0] == 1 ? 'notification' : 'notifications'} cleared successfully`
      );
    }
  } catch (error) {
    handleError(error);
  }
}
