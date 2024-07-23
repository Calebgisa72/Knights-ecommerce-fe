import React from 'react';
import { Buyer } from '../../../redux/reducers/vendorOrdersReducer';

interface Prop {
  buyerInfo?: Buyer;
}

const BuyerInfo = (props: Prop) => {
  return (
    <>
      {props.buyerInfo && (
        <>
          <h3 className="font-semibold w-[6.6rem] xmd:w-[6.8rem] lg:w-32 text-sm xmd:text-[.9rem] lg:text-base text-nowrap">
            Buyer Info
          </h3>
          <div className="flex flex-col gap-y-2 border rounded-md p-2 text-xs xmd:text-[.8rem] lg:text-[.9rem] text-neutral-700">
            <div className="flex justify-between">
              <span>Name:</span>
              <span>{props.buyerInfo.lastName + ' ' + props.buyerInfo.firstName}</span>
            </div>
            <div className="flex justify-between">
              <span>Gender:</span>
              <span>{props.buyerInfo.gender}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>
                <a
                  href={'mailto:' + props.buyerInfo.email}
                  target="_blank"
                  className="underline hover:text-black"
                  rel="noreferrer"
                >
                  {props.buyerInfo.email}
                </a>
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tel:</span>

              <span>
                <a
                  href={'tel:' + props.buyerInfo.phoneNumber}
                  target="_blank"
                  className="hover:text-black"
                  rel="noreferrer"
                >
                  {props.buyerInfo.phoneNumber}
                </a>
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BuyerInfo;
