import React from 'react';
import emptyCart from '../../images/empty-cart.png';
import { Link } from 'react-router-dom';
interface Props {
  link: string;
}
const OrderNotFound = (props: Props) => {
  return (
    <div className="flex flex-col items-center gap-y-2 xmd:gap-y-4 py-5">
      <img src={emptyCart} alt="emptyCart" className="w-16 md:w-20 ml-[-1.5rem]" />
      <div className="flex flex-col items-center gap-y-1">
        <p className="font-semibold text-base xmd:text-lg">ORDER NOT FOUND!</p>
        <p className="text-xs xmd:text-sm text-neutral-700 text-center leading-4">
          Looks like order you&apos;re trying to find does not exist.
        </p>
        <p className="text-xs xmd:text-sm text-neutral-700">
          Back to{' '}
          <Link to={props.link} className=" underline text-blue-600">
            Orders
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OrderNotFound;
