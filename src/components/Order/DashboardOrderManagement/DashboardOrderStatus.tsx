import React from 'react';
interface StatusProp {
  status: string;
}

const DashboardOrderStatus = (props: StatusProp) => {
  const result = props.status.toLowerCase();
  let color: string = 'text-baseBlack';
  if (props.status === 'completed') {
    color = 'bg-[#7E4FDF]';
  } else if (props.status === 'active') {
    color = 'bg-[#4D9A00]';
  } else if (props.status === 'order placed') {
    color = 'bg-[#FFD700]';
  } else if (props.status === 'received') {
    color = 'bg-[#20B2AA]';
  } else if (props.status === 'returned') {
    color = 'bg-[#DC143C]';
  } else if (props.status === 'cancelled') {
    color = 'bg-[#8C1823]';
  } else if (props.status === 'pending') {
    color = 'bg-[#FFA500]';
  } else if (props.status === 'is-accepted') {
    color = 'bg-[#20B2AA]';
  } else if (props.status === 'in-transit') {
    color = 'bg-[#0533D9]';
  } else if (props.status === 'delivered') {
    color = 'bg-[#4D9A00]';
  } else if (props.status === 'awaiting shipment') {
    color = 'bg-[#11A0D0]';
  }
  return (
    <div className="flex items-center gap-x-[.1rem] xmd:gap-x-1">
      <span className={color + ' block w-[.44rem] h-[.44rem] xmd:w-[.6rem] xmd:h-[.6rem] rounded-full'}></span>
      <span className="capitalize text-nowrap">{result}</span>
    </div>
  );
};

export default DashboardOrderStatus;
