import React, { FormEvent, useEffect, useState } from 'react';
import HeaderOrderManagement from '../../components/Order/DashboardOrderManagement/HeaderOrderManagement';
import SideBarOrderStatus from '../../components/Order/DashboardOrderManagement/SideBarOrderStatus';
import { BeatLoader, PulseLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import axios, { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import OrderNotFound from '../../components/Order/OrderNotFound';
import { useJwt } from 'react-jwt';
import { DecodedToken } from '../Authentication/Login';
import toast from 'react-hot-toast';
import { setOrderStats } from '../../redux/reducers/orderStatsReducer';
import { Order } from '../../redux/reducers/adminOrdersReducer';
import DashboardOrderStatus from '../../components/Order/DashboardOrderManagement/DashboardOrderStatus';
import BuyerInfo from '../../components/Order/DashboardOrderManagement/BuyerInfo';

export interface ErrorResponse {
  message: string;
}

const SingleAdminOrder = () => {
  const [activeStatus, setActiveStatus] = useState('');
  const [isEditable, setIsEditable] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(true);
  const [submitFormLoading, setSubmitFormLoading] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [notFound, setNotFound] = useState(false);
  let orderItemsIndex = 0;

  const dispatch = useDispatch<AppDispatch>();
  const orderStatsStates = useSelector((state: RootState) => state.orderStats);

  const { userToken } = useSelector((state: RootState) => state.auth);
  const { decodedToken } = useJwt<DecodedToken>(userToken);

  const params = useParams();
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
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_API_URL}/product/admin/orders/${params.orderId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        setOrder(data.data.order);
        setActiveStatus(data.data.order.orderStatus);
        if (data.data.order.orderStatus.toLowerCase() !== 'received') {
          setIsEditable(false);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if ((error as AxiosError).response && [400, 404].includes((error as AxiosError).response!.status)) {
          setNotFound(true);
        } else {
          navigate('orders');
        }
      }
    };

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.orderId, userToken]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitFormLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/product/admin/orders/${params.orderId}`,
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
      setSubmitFormLoading(false);
      setIsEditable(false);
    } catch (error) {
      console.log(error);
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
      setSubmitFormLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowMenu(false)}
      className="flex flex-col justify-start gap-8 py-8 w-full min-h-[100vh] h-full px-4 lg:px-10 2xl:px-20 bg-[#EEF5FF]"
    >
      <HeaderOrderManagement
        orderTimeIdentifier={order?.createdAt ? new Date(order?.createdAt).getTime().toString() : ''}
      />
      <div className="flex flex-col xlg:flex-row min-h-0 gap-7 w-full">
        {!notFound && !loading && (
          <div className="flex flex-col gap-y-7 bg-white rounded-lg border border-neutral-300 basis-3/4 py-5 px-2 xsm:py-8 xsm:px-4">
            <div className="flex flex-wrap gap-y-3 gap-x-1 lg:gap-5 justify-between">
              <div className="flex flex-col gap-y-2 ">
                <div className="flex items-center gap-x-3">
                  <p className="font-semibold w-[6.6rem] xmd:w-[6.8rem] lg:w-32 text-sm xmd:text-[.9rem] lg:text-base text-nowrap">
                    Order Status
                  </p>
                  {isEditable && (
                    <form action="" className="flex gap-x-1 lg:gap-x-2" onSubmit={submitHandler}>
                      <div
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                        className="relative  border-[1px] border-neutral-300 rounded-xl text-[.9rem] w-[5.5rem] xmd:w-[6.5rem]"
                      >
                        <div
                          onClick={() => setShowMenu((prevValue) => !prevValue)}
                          className={`${isEditable ? 'cursor-pointer' : ' cursor-not-allowed'} gap-x-1 pl-3 pr-2  py-[.3rem] rounded-xl flex items-center justify-between hover:bg-neutral-200 duration-300 active:bg-neutral-300`}
                        >
                          <input
                            type="text"
                            title={activeStatus}
                            className="w-full cursor-pointer outline-none bg-transparent capitalize text-xs xmd:text-[.8rem] lg:text-[.86rem]"
                            value={activeStatus.length > 8 ? activeStatus.slice(0, 7).trim() + '..' : activeStatus}
                            readOnly
                          />
                          <i className="fa-solid fa-chevron-down text-[.75rem] xmd:text-[.87rem]"></i>
                        </div>
                        {showMenu && (
                          <div className=" animate-slideInFromTop absolute top-8 left-[-2px] bg-baseWhite xmd:w-40 px-1 py-1 shadow-xl border-[1px] border-neutral-200 rounded-lg text-neutral-800 text-xs xmd:text-[.82rem] lg:text-[.92rem]">
                            <ul>
                              <li
                                onClick={() => {
                                  if (activeStatus.toLowerCase() !== 'completed') {
                                    setActiveStatus('completed');
                                    setShowMenu(false);
                                  }
                                }}
                                className={`${activeStatus.toLowerCase() !== status ? 'cursor-pointer hover:bg-neutral-100 active:bg-neutral-200' : ' cursor-not-allowed bg-neutral-200 text-neutral-500'} capitalize py-2 px-3 border-b-[1px]`}
                              >
                                Completed
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                      <button
                        type={submitFormLoading || activeStatus.toLowerCase() === 'received' ? 'button' : 'submit'}
                        className={`${activeStatus.toLowerCase() === 'received' ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-800'} flex items-center justify-center border-[1px] border-neutral-300 rounded-xl px-3 xmd:px-5 py-1 text-xs xmd:text-[.8rem] lg:text-[.9rem] bg-neutral-600 text-baseWhite font-medium w-20 lg:w-24`}
                      >
                        {!submitFormLoading && <span>UPDATE</span>}
                        {submitFormLoading && <PulseLoader color="#fff" size={6} />}
                      </button>
                    </form>
                  )}

                  {!isEditable && (
                    <div className="border-[1px] border-neutral-300 px-3 lg:px-4 py-1 rounded-xl">
                      <p className="capitalize text-xs xmd:text-[.8rem] lg:text-[.9rem]">{activeStatus}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-x-4 xmd:gap-x-3">
                  <p className="font-semibold w-[6.6rem] xmd:w-[6.8rem] lg:w-32 text-sm xmd:text-[.9rem] lg:text-base text-nowrap">
                    Order Address
                  </p>
                  <div className="border-[1px] border-neutral-300 rounded-xl px-3 lg:px-4 py-[.43rem]">
                    <p className="capitalize leading-3 text-xs xmd:text-[.8rem] lg:text-[.9rem] xmd:max-w-40 lg:max-w-none">
                      {order?.address.split(', ').join('-')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-x-3">
                  <p className="font-semibold w-[6.7rem] xmd:w-[6.8rem] lg:w-32 text-sm xmd:text-[.9rem] lg:text-base">
                    Placed Date
                  </p>
                  <div className="border-[1px] border-neutral-300 rounded-xl px-3 lg:px-4 py-1 text-[.9rem]">
                    <p className="text-xs xmd:text-[.8rem] lg:text-[.9rem]">
                      {order?.createdAt.toLocaleString().split('T')[0]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-x-3">
                  <p className="font-semibold w-[6.7rem] xmd:w-[6.8rem] lg:w-32 text-sm xmd:text-[.9rem] lg:text-base">
                    Total price
                  </p>
                  <div className="border-[1px] border-neutral-300 rounded-xl px-3 lg:px-4 py-1 text-[.9rem]">
                    <p className="text-xs xmd:text-[.8rem] lg:text-[.9rem]">RWF {order?.totalPrice}</p>
                  </div>
                </div>
              </div>
              <div className="min-w-[100%] sm:min-w-[40%]">
                <BuyerInfo buyerInfo={order?.buyer} />
              </div>
            </div>
            <table className="w-full">
              <thead className="text-[.75rem] xmd:text-[.82rem] lg:text-[.88rem]">
                <tr className=" bg-primary text-baseWhite font-normal h-11 xmd:h-12 text-left">
                  <th className="font-normal w-[12%] xmd:w-[10%] text-center xmd:text-left pl-2 lg:pl-3">
                    N<sup>o</sup>
                  </th>
                  <th className="font-normal w-[20%] xmd:w-[20%]">Product</th>
                  <th className="font-normal text-center xmd:text-left w-[15%] hidden xsm:table-cell">
                    {width < 640 ? 'Qty' : 'Quantity'}
                  </th>
                  <th className="font-normal w-[17%] xmd:w-[13%] hidden xsm:table-cell">
                    {width < 640 ? 'P/U' : 'Price/Unit'}
                  </th>
                  <th className="font-normal w-[20%] xmd:w-[20%] pl-2">Vendor</th>
                  <th className="font-normal w-[17%] xmd:w-[20%] pl-2 leading-3">Vendor status</th>
                </tr>
              </thead>
              <tbody className="text-[.7rem] xmd:text-[.76rem] lg:text-[.82rem]">
                {order?.vendors.map((vendor, index) =>
                  vendor.order.orderItems.map((item, itemIndex) => {
                    orderItemsIndex++;
                    return (
                      <tr key={`${index}${itemIndex}`} className="h-9 xmd:h-11 border-b-[1px] border-neutral-300">
                        <td className="text-center xmd:text-left pl-2 lg:pl-3">{orderItemsIndex}.</td>
                        <td className="leading-3" title={item.product.name}>
                          {width < 450 ? item.product.name.slice(0, 10) + '...' : item.product.name}
                        </td>
                        <td className="xmd:pl-3 text-center xmd:text-left hidden xsm:table-cell">{item.quantity}</td>
                        <td className="leading-3 hidden xsm:table-cell">RWF {item['price/unit']}</td>
                        {itemIndex === 0 && (
                          <>
                            <td
                              className={
                                (vendor.order.orderItems.length > 1
                                  ? 'leading-3 capitalize border-l-[1px] border-r-[1px] border-neutral-300'
                                  : '') + ' p-1 xsm:p-2 leading-3 capitalize'
                              }
                              rowSpan={vendor.order.orderItems.length}
                            >
                              <p className="leading-3 capitalize">{vendor.lastName + ' ' + vendor.firstName}</p>
                              <p className="leading-5 text-[.67rem] xmd:text-[.73rem] lg:text-[.8rem] text-neutral-600">
                                {vendor.phoneNumber}
                              </p>
                            </td>
                            <td className="leading-3 capitalize p-1 xsm:p-2" rowSpan={vendor.order.orderItems.length}>
                              {/* {vendor.order.orderItems.length} */}
                              <DashboardOrderStatus status={vendor.order.orderStatus} />
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
        {notFound && (
          <div className="flex justify-center items-center bg-white rounded-lg border border-neutral-300 basis-3/4 py-8 px-4">
            <OrderNotFound link={'/' + decodedToken?.role.toLowerCase() + '/dashboard/orders'} />
          </div>
        )}
        {loading && (
          <div className="flex flex-col gap-y-2 justify-center items-center bg-white rounded-lg border border-neutral-300 basis-3/4 py-8 px-4">
            <BeatLoader size={10} className="ml-[-.5rem]" color="#070F2B" />
            <p className="text-[.7rem] xmd:text-[.76rem] lg:text-[.82rem] text-neutral-800">
              Fetching Order Details, Please wait!
            </p>
          </div>
        )}
        <SideBarOrderStatus />
      </div>
    </div>
  );
};

export default SingleAdminOrder;
