import { faGreaterThan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { setOrders } from '../../redux/reducers/buyerOrdersReducer';
import BuyerOrderStatus from '../../components/Order/BuyerOrderStatus';
import { PropagateLoader } from 'react-spinners';

const BuyerOrders = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const { userToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { orders } = useSelector((state: RootState) => state.buyerOrders);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/product/client/orders`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        dispatch(setOrders(response.data.data.orders));
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch, userToken]);

  return (
    <div className="flex flex-col gap-y-5 lg:gap-y-8 text-baseBlack xmd:px-6 md:px-12 lg:px-24 py-10 lg:py-14">
      <nav className="xmd:block hidden">
        <ul className="flex items-center gap-x-2 text-base text-neutral-500">
          <li className="cursor-pointer hover:text-baseBlack" onClick={() => navigate('/')}>
            Home
          </li>
          <li>
            <FontAwesomeIcon icon={faGreaterThan} size="xs" />
          </li>
          <li>Orders</li>
        </ul>
      </nav>
      <h1 className="xmd:px-3 md:px-6 lg:px-12 xmd:text-left text-center text-xl xmd:text-2xl font-medium ">
        Order management
      </h1>
      <div className="px-3 md:px-6 lg:px-12">
        <table className="w-full text-left border-neutral-700">
          <thead>
            <tr className="text-neutral-700 border-b-[1px] h-12 border-neutral-300 text-[.93rem] xmd:text-base">
              <th className="font-medium leading-3 pr-3">Order #N</th>
              <th className="font-medium leading-3 pr-3">Order Date</th>
              <th className="font-medium leading-3">Price</th>
              <th className="font-medium leading-3">{width < 640 ? 'Qty' : 'Quantity'}</th>
              <th className="font-medium xmd:table-cell hidden">Address</th>
              <th className="font-medium leading-3">Status</th>
            </tr>
          </thead>
          {!loading && (
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="text-neutral-600 border-b-[1px] h-12 text-[.8rem] xmd:text-[.85rem] border-neutral-300 cursor-pointer hover:bg-neutral-200"
                >
                  <td className="pl-2 xmd:pl-6">{index + 1}</td>
                  <td>{order.createdAt.toLocaleString().split('T')[0]}</td>
                  <td>RWF {order.totalPrice}</td>
                  <td className="pl-2 lg:pl-6">{order.quantity}</td>
                  <td className="xmd:table-cell hidden capitalize text-wrap w-[25%] leading-4 pr-5">
                    {order.address.replaceAll(', ', ' - ')}
                  </td>
                  <td className="leading-4">
                    <BuyerOrderStatus status={order.orderStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {loading && (
          <div className="text-center pt-20 pb-14">
            <PropagateLoader className="bg-green-400 ml-[-2rem]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerOrders;
