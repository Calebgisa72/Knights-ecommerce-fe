import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { setCurrentBanner } from '../../redux/reducers/bannerReducer';

interface BannerIdentifierProps {
  index: number;
}

function BannerIdentifier({ index }: BannerIdentifierProps) {
  const { currentBanner } = useSelector((state: RootState) => state.banner);
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (index: number) => {
    dispatch(setCurrentBanner(index));
  };

  return (
    <div
      onClick={() => handleClick(index)}
      className={`${currentBanner === index ? 'w-[8px] h-[8px] bg-grey2' : 'w-[5px] h-[5px] bg-grey1'} rounded-full cursor-pointer`}
    ></div>
  );
}

export default BannerIdentifier;
