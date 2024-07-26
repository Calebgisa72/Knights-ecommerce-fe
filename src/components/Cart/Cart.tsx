import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchCart, removeFromCart } from '../../redux/actions/cartAction';
import CartSkeletonLoader from './CartSkeletonLoader';
import { X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cartData } from '../../types/cartTypes';
import { applyCoupon } from '../../utils/couponFunctions/applyCoupon';
import { BeatLoader } from 'react-spinners';

function Cart() {
  const dispatch = useDispatch<AppDispatch>();

  const { cart, cartItems, loading } = useSelector((state: RootState) => state.cart);
  const { userToken } = useSelector((state: RootState) => state.auth);
  const [loadingCoupon, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleRemoveFormCart = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUseCouponCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCouponCode(value);
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {loading ? (
        <CartSkeletonLoader />
      ) : (
        <div className="h-auto w-full p-10 flex items-start justify-center">
          <div className="w-[80vw] flex flex-col items-center justify-start gap-y-2">
            <div className="w-full items-center justify-start">
              <div className="w-full flex items-center justify-start text-primary">
                <h1 className="font-medium text-2xl sm:text-3xl font-poppins mb-2">Shopping Cart</h1>
              </div>
            </div>

            {cartItems.length > 0 ? (
              <>
                <div className="w-full overflow-x-auto" key="cartTable">
                  <div className="w-[1200px] grid grid-cols-12 mt-4 sm:w-full">
                    <div className="col-span-2 flex items-center justify-start">
                      <p className="font-medium font-poppins text-grey7 text-lg">Products</p>
                    </div>
                    <div className="col-span-3 flex items-center justify-start">
                      <p className="font-medium font-poppins text-grey7 text-lg">Title</p>
                    </div>
                    <div className="col-span-1 flex items-center justify-start ">
                      <p className="font-medium font-poppins text-grey7 text-lg">Price</p>
                    </div>
                    <div className="col-span-3 flex items-center justify-center">
                      <p className="font-medium font-poppins text-grey7 text-lg">Quantity</p>
                    </div>
                    <div className="col-span-2 flex items-center justify-start">
                      <p className="font-medium font-poppins text-grey7 text-lg">Total</p>
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <p className="font-medium font-poppins text-grey7 text-lg">Remove</p>
                    </div>
                  </div>
                  <div className="w-[1200px] sm:w-full h-[1px] bg-grey6 mt-1"></div>

                  {cartItems.map((item) => (
                    <React.Fragment key={item.id}>
                      <div className="w-[1200px] grid grid-cols-12 sm:w-full py-1">
                        <div className="col-span-2 flex items-center justify-start h-[75px]">
                          <div className="w-[55px] h-[70px]">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="col-span-3 flex items-center justify-start h-[75px]">
                          <p
                            className="font-normal text-base font-poppins text-grey7 cursor-pointer"
                            onClick={() => handleClick(item.product.id)}
                          >
                            {item.product.name}
                          </p>
                        </div>
                        <div className="col-span-1 flex items-center justify-start h-[75px]">
                          <p className="font-normal text-base font-poppins text-grey7">
                            RWF{parseInt(item.newPrice).toLocaleString()}
                          </p>
                        </div>
                        <div className="col-span-3 flex items-center justify-center h-[75px]">
                          <p className="font-medium font-poppins flex items-center justify-center py-2 px-5 border-[2px] border-grey6 text-grey7 text-lg">
                            {item.quantity}
                          </p>
                        </div>
                        <div className="col-span-2 flex items-center justify-start h-[75px]">
                          <p className="font-normal text-base font-poppins text-grey7">
                            RWF{parseInt(item.total).toLocaleString()}
                          </p>
                        </div>
                        <div className="col-span-1 flex items-center justify-end h-[75px]">
                          <p className="font-medium font-poppins text-grey7 text-lg">
                            <X
                              strokeWidth={1}
                              className="cursor-pointer"
                              onClick={() => handleRemoveFormCart(item.id)}
                            />
                          </p>
                        </div>
                      </div>
                      <div className="w-[1200px] sm:w-full h-[1px] bg-grey6 mt-1"></div>
                    </React.Fragment>
                  ))}
                </div>

                {cart && (
                  <>
                    <div className="w-full flex items-center justify-start text-primary mt-4">
                      <h1 className="font-bold text-lg sm:text-base font-poppins mb-2">Coupon Code</h1>
                    </div>

                    <div className="w-full flex items-center justify-start">
                      <input
                        type="text"
                        placeholder="COUPONCODE"
                        className="h-[50px] w-[70%] sm:w-[350px] border border-grey3 px-2 py-2 outline-none font-poppins font-normal"
                        value={couponCode}
                        onChange={handleUseCouponCode}
                      />
                      {!loadingCoupon && (
                        <button
                          onClick={() => applyCoupon(userToken, couponCode, setLoading)}
                          className="h-[50px] w-[150px] flex items-center justify-center  border border-primary bg-primary text-white text-sm sm:text-base font-poppins font-normal px-2"
                        >
                          Apply Coupon
                        </button>
                      )}
                      {loadingCoupon && (
                        <button className="h-[50px] w-[150px] flex items-center justify-center  border border-primary bg-primary px-2">
                          <BeatLoader size={10} color="#ffffff" />
                        </button>
                      )}
                    </div>

                    <div className="w-full flex items-center justify-start text-primary mt-8">
                      <h1 className="font-medium text-xl sm:text-xl font-poppins mb-2">Cart Totals</h1>
                    </div>

                    <div className="w-full items-center justify-start">
                      <div className="w-full sm:w-[500px] flex flex-col items-center justify-start mt-2">
                        <div className="w-full flex items-center justify-between py-1 text-grey7">
                          <p className="font-normal text-sm sm:text-lg font-poppins">Subtotals</p>
                          <p className="font-normal text-sm sm:text-lg font-poppins">
                            RWF
                            {parseInt((cart as cartData).totalAmount.toString()).toLocaleString()}
                          </p>
                        </div>
                        <div className="w-full h-[2px] bg-grey6 mt-1"></div>
                      </div>
                      <div className="w-full sm:w-[500px] flex flex-col items-center justify-start mt-3">
                        <div className="w-full flex items-center justify-between py-1 text-grey7">
                          <p className="font-normal text-sm sm:text-lg font-poppins">Delivery Fee</p>
                          <p className="font-normal text-sm sm:text-lg font-poppins">Free</p>
                        </div>
                        <div className="w-full h-[2px] bg-grey6 mt-1"></div>
                      </div>
                      <div className="w-full sm:w-[500px] flex flex-col items-center justify-start mt-2">
                        <div className="w-full flex items-center justify-between py-1 text-grey7">
                          <p className="font-medium text-sm sm:text-lg font-poppins">Total</p>
                          <p className="font-medium text-sm sm:text-lg font-poppins">
                            RWF
                            {parseInt((cart as cartData).totalAmount.toString()).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full items-center justify-start mt-4">
                      <Link
                        to={'/checkout'}
                        className="h-[50px] w-full sm:w-[500px] flex items-center justify-center  border border-primary bg-primary text-white font-poppins font-normal px-2"
                      >
                        PROCEED TO CHECKOUT
                      </Link>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-[20vh] flex items-start justify-start text-grey2">
                <p className="font-normal text-sm sm:text-base font-poppins mt-2">No item in cart at the moment</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
