import axios from 'axios';
import handleError from '../errorHandler';
import { setWishlist } from '../../redux/reducers/wishlistReducer';
import { AppDispatch } from '../../redux/store';

const fetchWishlist = async (userToken: string, dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/wish-list`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.message === 'No products in wish list') {
      return;
    }

    dispatch(setWishlist(response.data.productsForBuyer));
  } catch (error) {
    handleError(error);
  }
};

export default fetchWishlist;
