import { prodInWishlistProps, setWishlist } from '../../redux/reducers/wishlistReducer';
import axios from 'axios';
import handleError from '../../utils/errorHandler';
import toast from 'react-hot-toast';
import { ProductProp } from '../../components/Products/ProductCard/ClientProductCard';
import { AppDispatch } from '../../redux/store';

export const addProductToWishlist = async (
  userToken: string,
  dispatch: AppDispatch,
  products: prodInWishlistProps[],
  product: ProductProp,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/wish-list/add/${product.id}`, undefined, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    setLoading(false);
    if (response.status === 201) {
      dispatch(
        setWishlist([
          {
            productInfo: { ...product },
            wishListDetails: response.data.data.wishlistAdded
          },
          ...products
        ])
      );
      toast.success(`${product.name} added to wishlist`);
    }
  } catch (error) {
    handleError(error);
  }
};
