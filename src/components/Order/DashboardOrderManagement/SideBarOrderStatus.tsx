import React from 'react';
import DashboardOrderStatus from './DashboardOrderStatus';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useJwt } from 'react-jwt';
import { DecodedToken } from '../../../pages/Authentication/Login';
import { useParams } from 'react-router-dom';

const SideBarOrderStatus = () => {
  const { userToken } = useSelector((state: RootState) => state.auth);
  const { decodedToken } = useJwt<DecodedToken>(userToken);
  const params = useParams();

  return (
    <div
      className={
        (params.orderId ? 'flex-row xlg:flex-col ' : 'lg:flex-col ') +
        'flex flex-wrap gap-x-7 gap-y-8 lg:pl-7 p-5 lg:py-8 bg-white rounded-lg border border-neutral-300 basis-1/4 '
      }
    >
      <div>
        <h3 className="font-semibold mb-2 text-[.85rem] xmd:text-[.9rem] lg:text-base">Admin</h3>
        <ul className="flex flex-col gap-y-1 text-[.75rem] xmd:text-[.8rem] lg:text-[.85rem] pl-5">
          <li className="flex">
            <DashboardOrderStatus status="active" />
            &nbsp; <span>(Default)</span>
          </li>
          <li>
            <DashboardOrderStatus status="completed" />
          </li>
        </ul>
      </div>
      {decodedToken?.role.toLowerCase() === 'admin' && (
        <div>
          <h3 className="font-semibold mb-2 text-[.85rem] xmd:text-[.9rem] lg:text-base">Buyer</h3>
          <ul className="flex flex-col gap-y-1 text-[.75rem] xmd:text-[.8rem] lg:text-[.85rem] pl-5">
            <li>
              <DashboardOrderStatus status="received" />
            </li>
            <li>
              <DashboardOrderStatus status="order placed" />
            </li>
            <li>
              <DashboardOrderStatus status="returned" />
            </li>
            <li>
              <DashboardOrderStatus status="cancelled" />
            </li>
            <li>
              <DashboardOrderStatus status="awaiting shipment" />
            </li>
          </ul>
        </div>
      )}
      <div>
        <h3 className="font-semibold mb-2 text-[.85rem] xmd:text-[.9rem] lg:text-base">Vendor</h3>
        <ul className="flex flex-col gap-y-1 text-[.75rem] xmd:text-[.8rem] lg:text-[.85rem] pl-5">
          <li>
            <DashboardOrderStatus status="pending" />
          </li>
          <li>
            <DashboardOrderStatus status="is-accepted" />
          </li>
          <li>
            <DashboardOrderStatus status="in-transit" />
          </li>
          <li>
            <DashboardOrderStatus status="cancelled" />
          </li>
          <li>
            <DashboardOrderStatus status="delivered" />
          </li>
          <li>
            <DashboardOrderStatus status="awaiting shipment" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBarOrderStatus;
