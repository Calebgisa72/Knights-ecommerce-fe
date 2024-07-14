import React from 'react';
interface StatusProp {
  status: string;
}

const BuyerOrderStatus = (props: StatusProp) => {
  const result = props.status.toLowerCase();
  let color: string = 'text-baseBlack';
  if (props.status === 'completed') {
    color = 'text-blue-800';
  } else if (props.status === 'order placed') {
    color = 'text-[#FF8000]';
  } else if (props.status === 'received') {
    color = 'text-green-700';
  } else if (props.status === 'returned') {
    color = 'text-[#7E0FFF]';
  } else if (props.status === 'cancelled') {
    color = 'text-red-700';
  } else if (props.status === 'awaiting shipment') {
    color = 'text-[#11A0D0]';
  }
  return <span className={color + ' capitalize'}>{result}</span>;
};

export default BuyerOrderStatus;
