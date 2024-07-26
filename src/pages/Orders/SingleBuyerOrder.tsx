import axios, { AxiosError } from 'axios';
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { Order } from '../../redux/reducers/buyerOrdersReducer';
import toast from 'react-hot-toast';
import { BeatLoader, PulseLoader } from 'react-spinners';
import OrderNotFound from '../../components/Order/OrderNotFound';
import { setCreatedOrder } from '../../redux/reducers/createOrderReducer';

const SingleBuyerOrder = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [showMenu, setShowMenu] = useState(false);
  const [activeStatus, setActiveStatus] = useState('');
  const [order, setOrder] = useState<Order>();
  const { userToken } = useSelector((state: RootState) => state.auth);
  const formattedPriceNumber = new Intl.NumberFormat('en-US');
  const [isEditable, setIsEditable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitFormLoading, setSubmitFormLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const statuses = ['cancelled', 'received', 'returned'];

  const navigate = useNavigate();

  const params = useParams();

  const dispatch = useDispatch<AppDispatch>();

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
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/product/client/orders/${params.orderId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        );
        setOrder(data.data.order);
        setActiveStatus(data.data.order.orderStatus);
        if (['completed', 'cancelled', 'received', 'returned'].includes(data.data.order.orderStatus.toLowerCase())) {
          setIsEditable(false);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if ((error as AxiosError).response && [400, 404].includes((error as AxiosError).response!.status)) {
          setNotFound(true);
        } else {
          navigate('/orders');
        }
      }
    };

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.orderId, userToken]);

  const statusClickHandler = (status: string) => {
    setActiveStatus(status);
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setSubmitFormLoading(true);
    if (activeStatus.toLowerCase() === 'order placed') {
      setSubmitFormLoading(false);
      dispatch(setCreatedOrder(order?.cartId));
      navigate('/checkout');
      return;
    }
    const updateOrder = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data } = await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/product/client/orders/${params.orderId}`,
          { orderStatus: activeStatus.toLowerCase() },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        toast.success('Your order has been successfully updated.');
        setSubmitFormLoading(false);
        setIsEditable(false);
      } catch (error) {
        toast.error('Unable to update your order,\n Please try again!');
        setSubmitFormLoading(false);
      }
    };

    updateOrder();
  };
  return (
    <div
      onClick={() => setShowMenu(false)}
      className="flex justify-center text-baseBlack py-6 xmd:py-10 lg:py-20 px-3 xmd:px-[5%] md:px-[10%] lg:px-[15%]"
    >
      <div className="flex flex-col items-start xmd:items-center gap-y-5 md:gap-y-10 border-[1px] border-neutral-300 rounded-2xl px-3 md:px-8 py-5 md:py-10 w-full">
        {!notFound && !loading && (
          <>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-3">
                <p className="font-semibold w-[6.6rem] xmd:w-32 text-sm xmd:text-base text-nowrap">Order Status</p>
                {isEditable && (
                  <form action="" className="flex gap-x-1 xmd:gap-x-3 " onSubmit={submitHandler}>
                    {!(activeStatus.toLowerCase() === 'order placed') && (
                      <>
                        {' '}
                        <div
                          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                          className="relative  border-[1px] border-neutral-300 rounded-xl text-[.9rem] w-[5.5rem] xmd:w-32"
                        >
                          <div
                            onClick={() => setShowMenu((prevValue) => !prevValue)}
                            className={`${isEditable ? 'cursor-pointer' : ' cursor-not-allowed'} gap-x-1 xmd:gap-x-4 pl-3 pr-1 xmd:px-4 py-[.3rem] rounded-xl flex items-center justify-between hover:bg-neutral-200 duration-300 active:bg-neutral-300`}
                          >
                            <input
                              type="text"
                              title={activeStatus}
                              className="w-full cursor-pointer outline-none bg-transparent capitalize text-xs xmd:text-[.9rem]"
                              value={activeStatus.length > 8 ? activeStatus.slice(0, 7).trim() + '..' : activeStatus}
                              readOnly
                            />
                            <i className="fa-solid fa-chevron-down text-[.75rem] xmd:text-[.87rem]"></i>
                          </div>
                          {showMenu && (
                            <div className=" animate-slideInFromTop absolute top-8 left-[-2px] bg-baseWhite xmd:w-40 px-1 py-1 shadow-xl border-[1px] border-neutral-200 rounded-lg text-neutral-800">
                              <ul>
                                {statuses.map((status, index) => (
                                  <li
                                    key={index}
                                    onClick={() => {
                                      if (activeStatus.toLowerCase() !== status) {
                                        statusClickHandler(status);
                                        setShowMenu(false);
                                      }
                                    }}
                                    className={`${activeStatus.toLowerCase() !== status ? 'cursor-pointer hover:bg-neutral-100 active:bg-neutral-200' : ' cursor-not-allowed bg-neutral-200 text-neutral-500'} text-sm xmd:text-base capitalize py-1 px-3 border-b-[1px]`}
                                  >
                                    {status}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <button
                          type={
                            submitFormLoading || activeStatus.toLowerCase() === 'awaiting shipment'
                              ? 'button'
                              : 'submit'
                          }
                          className={`${activeStatus.toLowerCase() === 'awaiting shipment' ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-800'} flex items-center justify-center border-[1px] border-neutral-300 rounded-xl px-3 xmd:px-5 py-1 text-xs xmd:text-[.9rem] bg-neutral-600 text-baseWhite font-medium w-20 xmd:w-28`}
                        >
                          {!submitFormLoading && <span>UPDATE</span>}
                          {submitFormLoading && <PulseLoader color="#fff" size={6} />}
                        </button>
                      </>
                    )}
                    {activeStatus.toLowerCase() === 'order placed' && (
                      <>
                        <div className="relative  border-[1px] border-neutral-300 rounded-xl text-[.9rem] ">
                          <p className="capitalize text-xs xmd:text-[.9rem] px-3 xmd:px-4 py-[.3rem]">{activeStatus}</p>
                        </div>

                        <button
                          type={
                            submitFormLoading || activeStatus.toLowerCase() === 'awaiting shipment'
                              ? 'button'
                              : 'submit'
                          }
                          className="cursor-pointer hover:bg-green-900 bg-green-700 flex items-center justify-center border-[1px] border-neutral-300 rounded-xl px-3 xmd:px-5 py-1 text-xs xmd:text-[.9rem] text-baseWhite font-medium w-16"
                        >
                          {!submitFormLoading && <span>PAY</span>}
                          {submitFormLoading && <PulseLoader color="#fff" size={6} />}
                        </button>
                      </>
                    )}
                  </form>
                )}

                {!isEditable && (
                  <div className="border-[1px] border-neutral-300 text-[.9rem] px-3 xmd:px-4 py-1 rounded-xl">
                    <p className="capitalize text-xs xmd:text-[.9rem]">{activeStatus}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-x-4 xmd:gap-x-3">
                <p className="font-semibold w-[6.6rem] xmd:w-32 text-sm xmd:text-base text-nowrap">Order Address</p>
                <div className="border-[1px] border-neutral-300 rounded-xl px-3 xmd:px-4 py-[.43rem]">
                  <p className="capitalize leading-3 text-xs xmd:text-[.9rem]">
                    {order?.address.replaceAll(', ', ' - ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <p className="font-semibold w-[6.7rem] xmd:w-32 text-sm xmd:text-base">Placed Date</p>
                <div className="border-[1px] border-neutral-300 rounded-xl px-3 xmd:px-4 py-1 text-[.9rem]">
                  <p className="text-xs xmd:text-[.9rem]">{order?.createdAt.toLocaleString().split('T')[0]}</p>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <p className="font-semibold w-[6.7rem] xmd:w-32 text-sm xmd:text-base">Total price</p>
                <div className="border-[1px] border-neutral-300 rounded-xl px-3 xmd:px-4 py-1 text-[.9rem]">
                  <p className="text-xs xmd:text-[.9rem]">RWF {formattedPriceNumber.format(order?.totalPrice || 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <p className="font-semibold w-[6.7rem] xmd:w-32 text-sm xmd:text-base">Quantity</p>
                <div className="border-[1px] border-neutral-300 rounded-xl px-3 xmd:px-4 py-1 text-[.9rem] min-w-14">
                  <p className="text-xs xmd:text-[.9rem]">{order?.quantity}</p>
                </div>
              </div>
            </div>
            <div className="w-full">
              <p className="font-semibold text-sm xmd:text-base">Products</p>
              <table className="w-full">
                <thead className="">
                  <tr className="text-[.9rem] xmd:text-base bg-primary text-baseWhite font-normal h-11 xmd:h-14 text-left">
                    <th className="font-medium w-[12%] xmd:w-[15%] text-center xmd:text-left xmd:pl-6 lg:pl-10">
                      N<sup>o</sup>
                    </th>
                    <th className="font-medium w-[20%] xmd:w-[40%]">Product</th>
                    <th className="font-medium text-center xmd:text-left w-[15%] xmd:w-[25%]">
                      {width < 640 ? 'Qty' : 'Quantity'}
                    </th>
                    <th className="font-medium w-[17%] xmd:w-[25%]">{width < 640 ? 'P/U' : 'Price/Unit'}</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.orderItems.map((item, index) => (
                    <tr
                      key={index}
                      className="h-9 xmd:h-12 border-b-[1px] border-neutral-300 text-[.8rem] xmd:text-[.95rem]"
                    >
                      <td className="text-center xmd:text-left xmd:pl-6 lg:pl-10">{index + 1}</td>
                      <td className="leading-3">{item.product.name}</td>
                      <td className="xmd:pl-7 text-center xmd:text-left">{item.quantity}</td>
                      <td className="leading-3">RWF {formattedPriceNumber.format(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-20">
            <BeatLoader size={10} className="ml-[-.5rem]" color="#070F2B" />
            <p className="text-[.7rem] xmd:text-[.76rem] lg:text-[.82rem] text-neutral-800">
              Fetching Order Details, Please wait!
            </p>
          </div>
        )}
        {notFound && <OrderNotFound link="/orders" />}
      </div>
    </div>
  );
};

export default SingleBuyerOrder;
