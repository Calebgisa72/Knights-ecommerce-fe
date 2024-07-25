import React from 'react';
import formatDateAndTime from '../../utils/formartDate&Time';
import product from './assets/Avatar.svg';
import cart from './assets/Trolley.svg';
import order from './assets/Fast delivery.svg';
import user from './assets/User.svg';
import wishlist from './assets/Wishlist.svg';
import coupon from './assets/Gift card.svg';

import { setOpenNotification, setSelectedNotificationsIds } from '../../redux/reducers/notification';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { Link } from 'react-router-dom';

export interface NotificationProps {
  id: string;
  content: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

interface OneNotificationProps {
  noficationProp: NotificationProps;
}

const mapTypeImages: { [key: string]: string } = {
  product: product,
  cart: cart,
  order: order,
  user: user,
  wishlist: wishlist,
  coupon: coupon
};

function OneNotification({ noficationProp }: OneNotificationProps) {
  const { selectedNotificationsIds } = useSelector((state: RootState) => state.notification);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedIds = selectedNotificationsIds;
    const name = event.target.name;
    if (selectedIds.includes(name)) {
      dispatch(
        setSelectedNotificationsIds(
          selectedIds.filter((selectedId) => {
            return selectedId !== name;
          })
        )
      );
    } else {
      dispatch(setSelectedNotificationsIds([...selectedIds, name]));
    }
  };

  return (
    <div
      className={`flex gap-4 px-4 py-2 items-center border-b-[2px] border-neutral-300 ${noficationProp.isRead ? '' : 'bg-neutral-200'}`}
    >
      <div className="flex items-center justify-center">
        <input
          style={{ height: '1.2rem', width: '1.2rem', cursor: 'pointer' }}
          type="checkbox"
          name={noficationProp.id}
          checked={selectedNotificationsIds.includes(noficationProp.id)}
          onChange={handleChange}
        />
      </div>

      <div className="hidden sm:flex items-center w-7 mr-3">
        <img className="w-7" src={mapTypeImages[noficationProp.type]} alt="" />
      </div>

      <div className={`flex-1 flex flex-col ${noficationProp.link ? 'hover:cursor-pointer' : ''}`}>
        <div
          onClick={() => dispatch(setOpenNotification(false))}
          className={`${noficationProp.link ? 'underline' : ''} + text-[.85rem] xmd:text-[.9rem] lg:text-[.95rem]`}
        >
          {noficationProp.link ? (
            <Link to={noficationProp.link || '/'}>{noficationProp.content}</Link>
          ) : (
            noficationProp.content
          )}
        </div>
        <div className="flex gap-2 text-gray-500 text-sm">
          {noficationProp.type}
          <span>&#183;</span>
          {formatDateAndTime(noficationProp.createdAt).date}
        </div>
      </div>

      {!noficationProp.isRead && <div className="w-3 h-3 bg-black rounded-full"></div>}
    </div>
  );
}

export default OneNotification;
