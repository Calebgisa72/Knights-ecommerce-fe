import axios from 'axios';
import handleError from '../errorHandler';
import { prodInWishlistProps, setWishlist } from '../../redux/reducers/wishlistReducer';
import toast from 'react-hot-toast';
import { ProductProp } from '../../components/Products/ProductCard/ClientProductCard';
import { AppDispatch } from '../../redux/store';

const deleteWishlistProduct = async (
  userToken: string,
  dispatch: AppDispatch,
  id: number | null,
  products: prodInWishlistProps[],
  setInWishlist: React.Dispatch<React.SetStateAction<boolean>>,
  product: ProductProp,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    if (id === null) {
      return;
    }
    setLoading(true);
    const response = await axios.delete(`${import.meta.env.VITE_APP_API_URL}/wish-list/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    setLoading(false);
    if (response.status === 200) {
      const wishlistProducts: prodInWishlistProps[] = products.filter((product) => product.wishListDetails.id != id);
      dispatch(setWishlist(wishlistProducts));
      setInWishlist(false);
      toast.success(`${product.name} successfully removed from wishlist`);
    }
  } catch (error) {
    handleError(error);
  }
};

export default deleteWishlistProduct;
