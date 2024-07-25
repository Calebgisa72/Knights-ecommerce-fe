import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import deleteWishlistProduct from '../../../utils/wishlistFunctions/deleteWishlistProduct';
import { addProductToWishlist } from '../../../utils/wishlistFunctions/addProduct';
import ConfirmDeletePopup from '../../Popups/ConfirmDeletePopup';
import { BeatLoader } from 'react-spinners';

interface Props {
  product: ProductProp;
}
export interface Category {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  products: [
    {
      id: string;
    }
  ];
}
export interface User {
  firstName: string;
  lastName: string;
  status?: string;
}
export interface ProductProp {
  categories: Category[];
  createdAt: Date;
  description: string;
  expirationDate?: Date;
  feedbacks?: string[];
  id?: string;
  images: string[];
  isAvailable: boolean;
  name: string;
  newPrice: string;
  oldPrice?: string;
  quantity: string;
  updatedAt: Date;
  vendor: User;
}
const ClientProductCard = (props: Props) => {
  const { userToken } = useSelector((state: RootState) => state.auth);
  const { currentCategory } = useSelector((state: RootState) => state.category);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${props.product.id}`);
  };

  const { products, onWihlistPage } = useSelector((state: RootState) => state.wishlist);
  const [inWishlist, setInWishlist] = useState(false);
  const dispatch = useDispatch();
  const [wishlistId, setWishlistId] = useState<number | null>(null);

  useEffect(() => {
    let productInWishlist;
    if (products) {
      productInWishlist = products.find((product) => product.productInfo.id === props.product.id);
    }
    if (productInWishlist) {
      setInWishlist(true);
      setWishlistId(productInWishlist.wishListDetails.id);
    } else {
      setInWishlist(false);
      setWishlistId(null);
    }
  }, [products, props.product.id]);

  return (
    <div
      onClick={handleCardClick}
      data-testid="productDiv"
      className="group cursor-pointer flex flex-col gap-y-2 w-[15.6rem] text-sm hover:bg-neutral-200 p-2 rounded relative duration-200"
    >
      {userToken && (
        <div className="absolute right-4 top-4 z-40">
          {loading ? (
            <div
              data-testid="beatLoaderDiv"
              className="flex bg-baseWhite w-15 h-8 pt-[2px] justify-center xmd:items-center text-center rounded-sm text-sm"
            >
              <BeatLoader size={10} color="#073001" />
            </div>
          ) : onWihlistPage ? (
            <ConfirmDeletePopup
              trigger={
                <div className="group-hover:flex sm:flex md:hidden bg-baseWhite w-8 h-8 pt-[2px] justify-center xmd:items-center text-center rounded-full">
                  <i className="fa-regular fa-trash-can text-lg text-orange" data-testid="deleteButton"></i>
                </div>
              }
              title={`Confirm ${props.product.name} Deletion from your wishlist`}
              body={`Are you sure you want to delete ${props.product.name} product from your wishlist?`}
              onSubmit={() =>
                deleteWishlistProduct(
                  userToken,
                  dispatch,
                  wishlistId,
                  products,
                  setInWishlist,
                  props.product,
                  setLoading
                )
              }
            />
          ) : inWishlist ? (
            <div className="group-hover:flex sm:flex md:hidden bg-baseWhite w-8 h-8 pt-[2px] justify-center xmd:items-center text-center rounded-full">
              <i
                className="fa-solid fa-heart text-lg text-orange"
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  deleteWishlistProduct(
                    userToken,
                    dispatch,
                    wishlistId,
                    products,
                    setInWishlist,
                    props.product,
                    setLoading
                  );
                }}
                data-testid="removeButton"
              ></i>
            </div>
          ) : (
            <div className="group-hover:flex sm:flex md:hidden bg-baseWhite w-8 h-8 pt-[2px] justify-center xmd:items-center text-center rounded-full">
              <i
                className="fa-regular fa-heart text-lg"
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  addProductToWishlist(userToken, dispatch, products, props.product, setLoading);
                }}
                data-testid="addButton"
              ></i>
            </div>
          )}
        </div>
      )}
      <div className="bg-neutral-400 h-[19.5rem] p-2">
        <img src={props.product.images[0]} alt="" className=" h-full w-full object-contain" />
      </div>
      <div className="text-neutral-600">
        <p>{props.product.name}</p>
        {!props.product.categories[0] && <p>product</p>}
        {props.product.categories[0] && (
          <p className="text-[13px] ">
            {currentCategory
              ? currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1).toLowerCase()
              : props.product.categories[0].name.charAt(0).toUpperCase() +
                props.product.categories[0].name.slice(1).toLowerCase()}
          </p>
        )}
      </div>
      <p>{props.product.vendor?.lastName + ' ' + props.product.vendor?.firstName}</p>
      <p className="text-error200">RWF {props.product.newPrice}</p>
    </div>
  );
};
export default ClientProductCard;
