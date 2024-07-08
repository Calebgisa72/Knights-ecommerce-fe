import React from 'react';
interface StatusProp {
  status: string;
}

const BuyerOrderStatus = (props: StatusProp) => {
  const result = props.status.toLowerCase();
  let color: string = 'text-baseBlack';
  if (props.status === 'completed') {
    color = 'text-blue-700';
  } else if (props.status === 'order placed') {
    color = 'text-[#FEA500]';
  } else if (props.status === 'received') {
    color = 'text-green-700';
  } else if (props.status === 'returned') {
    color = 'text-[#7E4FDF]';
  } else if (props.status === 'cancelled') {
    color = 'text-red-700';
  }
  return <span className={color + ' capitalize'}>{result}</span>;
};

export default BuyerOrderStatus;
