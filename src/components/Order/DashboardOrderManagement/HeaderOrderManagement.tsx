import React from 'react';
import DashboardOrderStatus from './DashboardOrderStatus';
import { Link, useParams } from 'react-router-dom';
import { DecodedToken } from '../../../pages/Authentication/Login';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { useJwt } from 'react-jwt';
import { numFormat } from '../../../utils/numberFormat';

interface Prop {
  orderTimeIdentifier?: string;
}
const HeaderOrderManagement = (props: Prop) => {
  const { totalOrder, pendingOrder, completed, cancelled } = useSelector((state: RootState) => state.orderStats);
  const { userToken } = useSelector((state: RootState) => state.auth);
  const { decodedToken } = useJwt<DecodedToken>(userToken);

  const params = useParams();

  return (
    <div className="flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-8">
      <div>
        <h1 className="font-bold text-base xmd:text-lg lg:text-xl leading-5">All Orders</h1>
        <nav className="flex gap-x-1 items-center text-neutral-600 text-[.75rem] lg:text-sm">
          <span className="cursor-pointer hover:font-medium hover:text-black">
            <Link to={'/' + decodedToken?.role.toLowerCase() + '/dashboard'}>Home</Link>
          </span>
          <span>{'>'}</span>
          <span className={params.orderId && 'cursor-pointer hover:font-medium hover:text-black'}>
            {params.orderId ? (
              <Link to={'/' + decodedToken?.role.toLowerCase() + '/dashboard/orders'}>Order</Link>
            ) : (
              'Order'
            )}
          </span>
          {props.orderTimeIdentifier && params.orderId && (
            <>
              {' '}
              <span>{'>'}</span>
              <span>#Order-{props.orderTimeIdentifier}</span>
            </>
          )}
        </nav>
      </div>
      <div className="flex justify-between sm:text-red gap-2 xmd:gap-5 lg:gap-10 text-[.9rem] xmd:text-[.95rem]">
        <div className="flex flex-col items-center justify-center rounded-lg bg-primary w-full py-4 xmd:py-5 lg:py-7 text-white">
          <div className="flex flex-col gap-y-2 md:gap-y-4 lg:gap-y-6 justify-center px-2">
            <h2 className="font-semibold tracking-tight xmd:tracking-normal">Total Orders</h2>
            <div className="flex items-center gap-x-1 xmd:gap-x-2">
              <p className="text-nowrap text-[1.8rem] xmd:text-[2.8rem] lg:text-[3.5rem] leading-9 font-sans font-medium py-1 lg:py-2 pr-1 md:pr-3 lg:pr-5 border-r-2 tracking-tighter xmd:tracking-normal">
                {numFormat(totalOrder)}
              </p>
              <div className="text-[.66rem] sm:text-[.75rem] lg:text-[.8rem] ">
                <div className="flex gap-x-1 xmd:gap-x-3 lg:gap-x-4 font-medium pb-1 tracking-tight xmd:tracking-normal">
                  <span className="tracking-tighter xmd:tracking-normal font-sans">[{numFormat(completed)}]</span>
                  <DashboardOrderStatus status="completed" />
                </div>
                <div className="flex gap-x-1 xmd:gap-x-3 lg:gap-x-4 font-medium pb-1 tracking-tight xmd:tracking-normal">
                  <span className="tracking-tighter xmd:tracking-normal font-sans">[{numFormat(cancelled)}]</span>
                  <DashboardOrderStatus status="cancelled" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg bg-white border-2 border-neutral-200 w-full md:py-4 lg:py-7 px-1">
          <div className="flex flex-col gap-y-2 md:gap-y-4 lg:gap-y-6 items-center justify-center">
            <h2 className="font-semibold tracking-tight xmd:tracking-normal leading-4">Pending Orders</h2>
            <p className="text-[1.8rem] xmd:text-[2.8rem] lg:text-[3.5rem] font-sans leading-9 font-medium py-1 lg:py-2  tracking-tighter xmd:tracking-normal">
              {numFormat(pendingOrder)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderOrderManagement;
