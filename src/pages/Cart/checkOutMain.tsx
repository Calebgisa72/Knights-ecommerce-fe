import React from 'react';
import knightsLogo from '../../images/logo.png';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
import CreateOrder from '../../components/Order/CreateOrder';
import Checkout from '../../components/Checkout/checkout';

const CheckOutMain = () => {
  const { createdOrder } = useSelector((state: RootState) => state.createOrder);
  return (
    <div className="flex w-full items-center justify-center flex-col">
      <div className="flex flex-col py-6 items-center justify-center w-full bg-[#CDCDCD]/50">
        <img src={knightsLogo} alt="Knights Store Logo" />
        <p className="text-3xl font-medium">Checkout</p>
        <p className="text-sm flex items-center gap-x-1">
          <span>
            <Link to="/" className="font-medium">
              Home
            </Link>
          </span>
          <span>&gt;</span>
          Checkout
        </p>
      </div>
      <div className="flex gap-8  w-full items-center justify-center ">
        {!createdOrder && <CreateOrder />}
        {createdOrder && (
          <div className="lg:w-1/2 w-full">
            <Checkout />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOutMain;
