import React, { useEffect, useState } from 'react';
import ClientProductCard from '../../components/Products/ProductCard/ClientProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import fetchWishlist from '../../utils/wishlistFunctions/fetchWishlist';
import { clearAll } from '../../utils/wishlistFunctions/clearAll';
import ConfirmDeletePopup from '../../components/Popups/ConfirmDeletePopup';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';

function WishlistPage() {
  const { userToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.wishlist);
  const [wishlistProducts, setWishlistProducts] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (userToken) {
      const fetchData = async () => {
        try {
          await fetchWishlist(userToken, dispatch);
          setLoading(false);
        } catch (error) {
          toast.error('Failed to fetch wishlist');
        }
      };
      fetchData();
    }
  }, [userToken, dispatch]);

  useEffect(() => {
    const productCards: JSX.Element[] = [];
    products.forEach((product, index) => {
      productCards.push(<ClientProductCard product={product.productInfo} key={index} />);
    });
    setWishlistProducts(productCards);
  }, [products]);

  return (
    <div className="text-black flex justify-center">
      <div className="w-[90%] p-4 flex flex-col min-h-[480px]">
        <div className="flex justify-between items-center mb-8 xmd:px-8">
          {products.length > 0 && <h2 className="font-medium text-[25px]">Wishlist</h2>}
          {products.length > 1 && (
            <div>
              <ConfirmDeletePopup
                trigger={<p className=" text-[16px] hover:underline cursor-pointer">Clear All</p>}
                title={`Confirm removing all products from your wishlist`}
                body={`Are you sure you want to remove all products from your from wishlist?`}
                onSubmit={() => clearAll(userToken, dispatch, setLoading)}
              />
            </div>
          )}
        </div>
        {!loading && wishlistProducts.length > 0 && (
          <div className="w-full flex gap-y-10 justify-center flex-wrap gap-x-3 px-6 xmd:px-0">{wishlistProducts}</div>
        )}

        {!loading && products.length === 0 && (
          <p className="text-[20px] font-medium self-center">Your wishlist is empty.</p>
        )}

        {loading && (
          <div className="w-full flex justify-center px-6 py-20" data-testid="loading-spinner">
            <PropagateLoader color="#070f2b" />
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
