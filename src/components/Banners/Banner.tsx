import React from 'react';
import { Link } from 'react-router-dom';

interface BannerProps {
  rate: number;
  time: string;
  image: string;
  id: string;
}

const Banner = ({ rate, time, image, id }: BannerProps) => {
  return (
    <div className="animate-slideInToLeft flex flex-col xmd:flex-row items-center justify-center xmd:justify-between px-6 lg:px-20 py-3 xmd:py-7 h-[20rem] xmd:h-[20rem] bg-gradient-to-r from-neutral-200 from-5% via-neutral-200 via-20% to-neutral-100 to-55% w-[100%] xmd:w-[90%]">
      <div className="flex flex-row flex-wrap xmd:flex-col order-2 xmd:order-1 items-center justify-center xmd:items-start xmd:justify-start gap-x-8 gap-y-2 xmd:gap-y-2 w-[90%] xmd:w-[45%] lg:w-[50%] ">
        <div className="font-medium text-[1.8rem] xmd:text-[2.3rem] lg:text-[3rem]">FLAT {rate}% OFF</div>
        <div className="text-[1.2rem] xmd:text-[1.3] lg:text-[1.6rem]">
          <span className="text-orange">{time.split(' ')[0]} </span>
          {time.split(' ').slice(1).join(' ')}
        </div>
        <Link to={`/product/${id}`}>
          <div className="hover:cursor-pointer  flex items-center justify-center w-[90%] max-w-[200px] xmd:w-[100px] lg:w-[150px] bg-primary text-baseWhite rounded-3xl py-[0.5rem] my-3">
            Buy Now
          </div>
        </Link>
      </div>

      <div className="flex order-1 xmd:order-2 xmd:xmd:flex justify-end h-[55%] xmd:h-[100%] w-[90%] xmd:w-[55%] lg:w-[30%]">
        <img
          className="w-[100%] xmd:w-[100] md:w-[100%] lg:w-[100%] py-2 xmd:p-0 object-cover xmd:object-contain"
          src={image}
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;
