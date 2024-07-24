import React, { useEffect, useState } from 'react';
import searchIcon from '/search.svg';
import HeaderOrderManagement from '../../components/Order/DashboardOrderManagement/HeaderOrderManagement';
import DashboardOrderStatus from '../../components/Order/DashboardOrderManagement/DashboardOrderStatus';
import SideBarOrderStatus from '../../components/Order/DashboardOrderManagement/SideBarOrderStatus';
import OrderPagination from '../../components/Order/DashboardOrderManagement/OrderPagination';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Order, setVendorOrders } from '../../redux/reducers/vendorOrdersReducer';
import { setOrderStats } from '../../redux/reducers/orderStatsReducer';
import { BeatLoader } from 'react-spinners';

interface Pagination {
  start: number;
  end: number;
  total: number;
}
const VendorOrder = () => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ start: 0, end: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const { userToken } = useSelector((state: RootState) => state.auth);
  const { orders } = useSelector((state: RootState) => state.vendorOrders);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/product/vendor/orders`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        setPagination((prevData) => {
          prevData.start = 1;
          prevData.end = response.data.data.orders.length > 6 ? 6 : response.data.data.orders.length;
          prevData.total = response.data.data.orders.length;
          return prevData;
        });
        dispatch(setVendorOrders(response.data.data.orders));

        const stats = {
          totalOrder: response.data.data.orders.length,
          completed: 0,
          cancelled: 0,
          pendingOrder: 0
        };
        (response.data.data.orders as Order[]).map((order) => {
          switch (order.orderStatus.toLowerCase()) {
            case 'completed':
              stats.completed += 1;
              break;
            case 'cancelled':
              stats.cancelled += 1;
              break;
            case 'pending':
              stats.pendingOrder += 1;
              break;
            case 'is-accepted':
              stats.pendingOrder += 1;
              break;
            case 'in-transit':
              stats.pendingOrder += 1;
              break;
          }
        });

        dispatch(setOrderStats({ ...stats }));
        setLoading(false);
      } catch (error) {
        dispatch(setOrderStats({ totalOrder: 0, completed: 0, cancelled: 0, pendingOrder: 0 }));
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch, userToken]);

  const setPage = (event: React.ChangeEvent<unknown>, value: number) => {
    const newStart = value * 6 - 5;
    const newEnd = value * 6 > orders.length ? orders.length : value * 6;

    setPagination({
      start: newStart,
      end: newEnd,
      total: pagination.total
    });
  };

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const result: Order[] = orders.filter((order) => {
      const fullName = `${order.buyer.firstName.toLowerCase()} ${order.buyer.lastName.toLowerCase()}`;
      const address = order.address.toLowerCase();
      return fullName.includes(searchTerm) || address.includes(searchTerm);
    });
    setPagination((prevData) => {
      prevData.start = result.length ? 1 : 0;
      prevData.end = result.length > 6 ? 6 : result.length;
      prevData.total = result.length;
      return prevData;
    });

    setFilteredOrders(result);
  };

  return (
    <div className="flex flex-col justify-start gap-8 py-8 w-full min-h-[100vh] h-full px-4 lg:px-10 2xl:px-20 bg-[#EEF5FF]">
      <HeaderOrderManagement />
      <div className="flex flex-col lg:flex-row min-h-0 gap-7 w-full">
        <div className="flex flex-col justify-between gap-y-7 bg-white rounded-lg border border-neutral-300 basis-3/4 p-3 transition-transform">
          <div className="flex flex-col gap-y-7">
            <div className="flex gap-x-2 xmd:gap-x-6 justify-end text-[.7rem] lg:text-sm text-nowrap">
              <div className="flex items-center gap-x-1 border focus-within:border-neutral-900 border-neutral-400 rounded-lg py-[.35rem] pl-3 pr-3 xmd:pr-12 overflow-hidden">
                <img src={searchIcon} alt="search-icon" className="w-4 lg:w-5" />
                <span className="">
                  <input
                    type="text"
                    placeholder="Search by Buyer, Address"
                    onChange={searchHandler}
                    className="outline-none"
                  />
                </span>
              </div>
              <div className="flex items-center justify-center py-[.3rem] gap-x-2 px-3 bg-primary text-white rounded-md">
                <span>Filter</span>
                <span className="material-symbols-outlined text-xl leading-3">filter_list</span>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="text-[.75rem] xmd:text-[.82rem] lg:text-[.88rem]">
                <tr className="bg-primary text-white h-12 ">
                  <th className="font-normal px-3">
                    N<sup>o</sup>
                  </th>
                  <th className="font-normal">Buyer</th>
                  <th className="font-normal">Address</th>
                  <th className="font-normal hidden xmd:table-cell align-middle">Placed Date</th>
                  <th className="font-normal">Order Status</th>
                </tr>
              </thead>
              {!loading && (
                <tbody className="text-[.7rem] xmd:text-[.76rem] lg:text-[.82rem]">
                  {!filteredOrders.length
                    ? orders.slice(pagination.start - 1, pagination.end).map((order, index) => (
                        <tr
                          key={index}
                          onClick={() => navigate(`${order.id}`)}
                          className="border-b-[1px] h-14 border-neutral-300 cursor-pointer hover:bg-neutral-200"
                        >
                          <td className="px-3">{pagination.start + index}</td>
                          <td>
                            <p className="leading-3 capitalize">
                              {order.buyer.firstName + ' ' + order.buyer.firstName}
                            </p>
                            <p className="text-[.67rem] xmd:text-[.73rem] lg:text-[.8rem] text-neutral-600">
                              {order.buyer.phoneNumber}
                            </p>
                          </td>
                          <td>
                            <p className="leading-3">{order.address.split(', ').slice(0, 2).join('-')}</p>
                            <p>{order.address.split(', ')[2]}</p>
                          </td>
                          <td className="hidden xmd:table-cell align-middle">
                            {order.createdAt.toLocaleString().split('T')[0]}
                          </td>
                          <td>
                            <DashboardOrderStatus status={order.orderStatus.toLowerCase()} />
                          </td>
                        </tr>
                      ))
                    : filteredOrders.slice(pagination.start - 1, pagination.end).map((order, index) => (
                        <tr
                          key={index}
                          onClick={() => navigate(`${order.id}`)}
                          className="border-b-[1px] h-14 border-neutral-300 cursor-pointer hover:bg-neutral-200"
                        >
                          <td className="px-3">{pagination.start + index}</td>
                          <td>
                            <p className="leading-3 capitalize">
                              {order.buyer.firstName + ' ' + order.buyer.firstName}
                            </p>
                            <p className="text-[.67rem] xmd:text-[.73rem] lg:text-[.8rem] text-neutral-600">
                              {order.buyer.phoneNumber}
                            </p>
                          </td>
                          <td>
                            <p className="leading-3">{order.address.split(', ').slice(0, 2).join('-')}</p>
                            <p>{order.address.split(', ')[2]}</p>
                          </td>
                          <td className="hidden xmd:table-cell align-middle">
                            {order.createdAt.toLocaleString().split('T')[0]}
                          </td>
                          <td>
                            <DashboardOrderStatus status={order.orderStatus.toLowerCase()} />
                          </td>
                        </tr>
                      ))}
                </tbody>
              )}
            </table>
          </div>
          {loading && (
            <div className="flex flex-col gap-y-2 justify-center items-center">
              <BeatLoader size={10} className="ml-[-.5rem]" color="#070F2B" />
              <p className="text-[.7rem] xmd:text-[.76rem] lg:text-[.82rem] text-neutral-800">
                Fetching your orders, please wait!
              </p>
            </div>
          )}
          {!orders.length && !loading && (
            <div className="flex justify-center items-center text-[.8rem] md:text-[.9rem]">
              <p>Currently, no orders are in the system!</p>
            </div>
          )}
          {orders.length && (
            <OrderPagination start={pagination.start} end={pagination.end} total={pagination.total} setPage={setPage} />
          )}
        </div>
        <div>
          <SideBarOrderStatus />
        </div>
      </div>
    </div>
  );
};

export default VendorOrder;
