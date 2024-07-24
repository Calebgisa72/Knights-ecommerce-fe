import React, { useEffect, useState } from 'react';
import searchIcon from '/search.svg';
import HeaderOrderManagement from '../../components/Order/DashboardOrderManagement/HeaderOrderManagement';
import SideBarOrderStatus from '../../components/Order/DashboardOrderManagement/SideBarOrderStatus';
import OrderPagination from '../../components/Order/DashboardOrderManagement/OrderPagination';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Order, setAdminOrders } from '../../redux/reducers/adminOrdersReducer';
import { setOrderStats } from '../../redux/reducers/orderStatsReducer';
import { BeatLoader, PulseLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { ErrorResponse } from './SingleAdminOrder';

interface Pagination {
  start: number;
  end: number;
  total: number;
}
const AdminOrders = () => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ start: 0, end: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState<number>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const { userToken } = useSelector((state: RootState) => state.auth);
  const { orders } = useSelector((state: RootState) => state.adminOrders);

  const orderStatsStates = useSelector((state: RootState) => state.orderStats);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/product/admin/orders`, {
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
        dispatch(setAdminOrders(response.data.data.orders));

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
            case 'returned':
              break;
            default:
              stats.pendingOrder += 1;
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

  const updateOrderHandler = async (id: string) => {
    setSubmitLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/product/admin/orders/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      dispatch(
        setOrderStats({
          ...orderStatsStates,
          pendingOrder: orderStatsStates.pendingOrder + 1,
          completed: orderStatsStates.completed + 1
        })
      );

      toast.success('The order has been successfully updated.');
      setShowMenu(undefined);
      setSubmitLoading(false);
    } catch (error) {
      if ((error as AxiosError).response && [400, 404].includes((error as AxiosError).response!.status)) {
        toast.error('Unable to update your order,\n Please try again!');
      } else {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data.message) {
          toast.error(axiosError.response?.data.message);
        } else {
          toast.error('Something went wrong,\n Please try again!');
        }
      }
      setSubmitLoading(false);
    }
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
                  <th className="font-normal align-middle">Placed Date</th>
                  <th className="font-normal">Completed</th>
                  <th className="font-normal hidden xmd:table-cell">Action</th>
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
                          <td className="align-middle">{order.createdAt.toLocaleString().split('T')[0]}</td>
                          <td className="align-middle pl-6 xmd:pl-8 text-base">
                            {order.orderStatus.toLowerCase() === 'completed' ? (
                              <i className="fa-solid fa-check text-green-700"></i>
                            ) : (
                              <i className="fa-solid fa-x text-red-700"></i>
                            )}
                          </td>
                          <td
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                              e.stopPropagation();
                              setShowMenu(undefined);
                              setShowMenu(index);
                            }}
                            data-testid="menuAction"
                            className="group relative hidden xmd:table-cell pl-5"
                          >
                            <i className="group-hover:text-base fa-solid fa-ellipsis-vertical"></i>

                            {showMenu === index && (
                              <div
                                onMouseLeave={() =>
                                  setTimeout(() => {
                                    setShowMenu(undefined);
                                  }, 300)
                                }
                                className="z-10 animate-slideInFromTop absolute top-2 right-3 bg-baseWhite xmd:w-40 px-1 py-2 shadow-xl border-[1px] border-neutral-200 rounded-lg text-[.7rem] xmd:text-[.76rem] lg:text-[.8rem]"
                              >
                                <ul>
                                  <li
                                    onClick={() => navigate(`${order.id}`)}
                                    className="cursor-pointer hover:bg-neutral-200 active:bg-neutral-200 bg-neutral-100 py-2 px-2 border-b-[1px] border-neutral-300"
                                  >
                                    View & Update
                                  </li>
                                  <li
                                    data-testid='data-testid="menuActionUpdate'
                                    onClick={() => {
                                      if (order.orderStatus.toLowerCase() !== 'completed') {
                                        updateOrderHandler(order.id);
                                      }
                                    }}
                                    className={
                                      (order.orderStatus.toLowerCase() === 'completed'
                                        ? 'cursor-not-allowed text-neutral-500'
                                        : 'cursor-pointer hover:bg-neutral-200 active:bg-neutral-200') +
                                      '  bg-neutral-100 py-2 px-2 border-b-[1px] border-neutral-300'
                                    }
                                  >
                                    {!submitLoading && <span>Mark as Completed</span>}
                                    {submitLoading && <PulseLoader color="#000" size={6} className="text-center" />}
                                  </li>
                                </ul>
                              </div>
                            )}
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
                          <td className="align-middle">{order.createdAt.toLocaleString().split('T')[0]}</td>
                          <td className="align-middle pl-6 xmd:pl-8 text-base">
                            {order.orderStatus.toLowerCase() === 'completed' ? (
                              <i className="fa-solid fa-check text-green-700"></i>
                            ) : (
                              <i className="fa-solid fa-x text-red-700"></i>
                            )}
                          </td>
                          <td
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                              e.stopPropagation();
                              setShowMenu(undefined);
                              setShowMenu(index);
                            }}
                            data-testid="menuAction"
                            className="group relative hidden xmd:table-cell pl-5"
                          >
                            <i className="group-hover:text-base fa-solid fa-ellipsis-vertical"></i>

                            {showMenu === index && (
                              <div
                                onMouseLeave={() =>
                                  setTimeout(() => {
                                    setShowMenu(undefined);
                                  }, 300)
                                }
                                className="z-10 animate-slideInFromTop absolute top-2 right-3 bg-baseWhite xmd:w-40 px-1 py-2 shadow-xl border-[1px] border-neutral-200 rounded-lg text-[.7rem] xmd:text-[.76rem] lg:text-[.8rem]"
                              >
                                <ul>
                                  <li
                                    onClick={() => navigate(`${order.id}`)}
                                    className="cursor-pointer hover:bg-neutral-200 active:bg-neutral-200 bg-neutral-100 py-2 px-2 border-b-[1px] border-neutral-300"
                                  >
                                    View & Update
                                  </li>
                                  <li
                                    data-testid='data-testid="menuActionUpdate'
                                    onClick={() => {
                                      if (order.orderStatus.toLowerCase() !== 'completed') {
                                        updateOrderHandler(order.id);
                                      }
                                    }}
                                    className={
                                      (order.orderStatus.toLowerCase() === 'completed'
                                        ? 'cursor-not-allowed text-neutral-500'
                                        : 'cursor-pointer hover:bg-neutral-200 active:bg-neutral-200') +
                                      '  bg-neutral-100 py-2 px-2 border-b-[1px] border-neutral-300'
                                    }
                                  >
                                    {!submitLoading && <span>Mark as Completed</span>}
                                    {submitLoading && <PulseLoader color="#000" size={6} className="text-center" />}
                                  </li>
                                </ul>
                              </div>
                            )}
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
                Fetching orders, Please wait!
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

export default AdminOrders;
