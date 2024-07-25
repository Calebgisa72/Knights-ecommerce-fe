import axios from 'axios';
import { setWishlist } from '../../redux/reducers/wishlistReducer';
import handleError from '../../utils/errorHandler';
import toast from 'react-hot-toast';
import { AppDispatch } from '../../redux/store';

export const clearAll = async (
  userToken: string,
  dispatch: AppDispatch,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const response = await axios.delete(`${import.meta.env.VITE_APP_API_URL}/wish-list/clearAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    setLoading(false);
    if (response.status === 200) {
      dispatch(setWishlist([]));
      toast.success(`Removed all products from wishlist`);
    }
  } catch (error) {
    handleError(error);
  }
};
