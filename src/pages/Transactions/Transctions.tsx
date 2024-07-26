import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PropagateLoader } from 'react-spinners';
import { ApiResponse } from '../../types/paymentTypes';

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      const tokenString = localStorage.getItem('userToken');

      if (!tokenString) {
        console.error('Token not found');
        setLoading(false);
        return;
      }

      const { token } = JSON.parse(tokenString);

      setLoading(true);
      try {
        const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_APP_API_URL}/product/transaction`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setData(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatNumber = (number: number) => new Intl.NumberFormat().format(number);

  if (loading) {
    return (
      <div className="w-full flex justify-center px-6 py-20" data-testid="loading-spinner">
        <PropagateLoader color="#070f2b" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-4xl font-bold p-8">No data available</p>;
  }

  return (
    <div className="flex flex-col gap-12 p-8 bg-[#EEF5FF] min-h-[calc(100vh-94px)] " data-testid="transactions">
      <div className="flex flex-col">
        <p className="text-4xl font-bold">Transactions</p>
        <p className="text-[14px] font-light">Home &gt; Transactions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 xmd:gap-14 w-full sm:h-[140px] ">
        <div className="h-full w-full text-white border border-[#D1D1D1] bg-primary items-center sm:items-start justify-center p-8 flex flex-col gap-1 rounded-xl">
          <p className="font-medium text-lg">Total Amount</p>
          {loading ? (
            <p className="text-3xl text-center sm:text-start font-bold">0</p>
          ) : (
            <div className="flex flex-col gap-1">
              <p data-testid="totalVendors" className="text-3xl text-center sm:text-start font-bold">
                {formatNumber(data.statistics.totalAmount)} Rwf
              </p>
              <div className="flex gap-2 text-white">
                <span data-testid="averagePayment" className="py-1 text-[13px] px-2 bg-[#4D9A00] rounded-md">
                  Average: {formatNumber(data.statistics.averagePaymentAmount)}
                </span>
                <span data-testid="capturedAmount" className="py-1 text-[13px] px-2 bg-gray-500 rounded-md">
                  Captured: {formatNumber(data.statistics.totalCapturedAmount)}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="h-full w-full bg-white border-[1px] border-[#D1D1D1] text-primary items-center sm:items-start justify-center p-8  flex flex-col gap-1 rounded-xl">
          <p className="font-medium text-lg">Total Transactions</p>
          {loading ? (
            <p className="text-3xl text-center sm:text-start font-bold">0</p>
          ) : (
            <div className="flex flex-col gap-1">
              <p data-testid="totalBuyers" className="text-3xl text-center sm:text-start font-bold">
                {data.statistics.totalPayments}
              </p>
              <div className="flex gap-2 text-white">
                <span data-testid="successfulPayments" className="py-1 text-[13px] px-2 bg-[#4D9A00] rounded-md">
                  Success: {data.statistics.successfulPayments}
                </span>
                <span data-testid="pendingPayments" className="py-1 text-[13px] px-2 bg-gray-500 rounded-md">
                  Pending: {data.statistics.pendingPayments}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className=" flex flex-col items-center justify-start gap-y-2 overflow-hidden">
        {data.payments.length > 0 ? (
          <div className="w-full flex flex-col p-8 bg-white rounded-2xl border border-[#D1D1D1] overflow-auto">
            <div className="w-full min-w-[1000px] overflow-x-auto" key={data.payments.length}>
              <div
                data-testid="userPropsTable"
                className="p-2 bg-primary grid grid-cols-12 gap-2 w-full font-medium font-poppins text-white text-[14px] "
              >
                <div className="col-span-1 flex items-center justify-start">
                  <p>No</p>
                </div>
                <div className="col-span-3 flex items-center justify-start">
                  <p>Payment id</p>
                </div>
                <div className="col-span-3 flex items-center justify-start ">
                  <p>Amount</p>
                </div>
                <div className="col-span-2 flex flex-col gap-1 justify-center">
                  <p>Date</p>
                </div>
                <div className="col-span-2 flex items-center justify-start">
                  <p>Status</p>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <p>payment method</p>
                </div>
              </div>
              {data.payments.map((payment, index) => {
                return (
                  <div key={payment.id} data-testid="userDiv">
                    <div className="px-2 grid h-[60px] grid-cols-12 gap-2 xmd:w-full font-poppins text-[14px]">
                      <div className="col-span-1 flex items-center justify-start">
                        <p>{index + 1}</p>
                      </div>
                      <div className="col-span-3 flex items-center justify-start max-w-12">
                        <p>{payment.id}</p>
                      </div>
                      <div className="col-span-3 flex items-center justify-start ">
                        <p>{payment.amount}</p>
                      </div>
                      <div className="col-span-2 flex flex-col gap-1 justify-center text-[13px]">
                        {new Date(payment.created * 1000).toLocaleDateString()}
                      </div>
                      {payment.status.toLowerCase() === 'succeeded' ? (
                        <div className="col-span-2 flex items-center gap-1 justify-start">
                          <div className="w-[10px] h-[10px] rounded-full bg-[#4D9A00]"></div>
                          <p>Successful</p>
                        </div>
                      ) : (
                        <div className="col-span-2 flex items-center gap-1 justify-start">
                          <div className="w-[10px] h-[10px] rounded-full bg-[#717171]"></div>
                          <p>Pending</p>
                        </div>
                      )}
                      <div className="col-span-1 flex items-center justify-end">
                        <p>{payment.payment_method_types[0].toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="w-[1000px] xmd:w-full h-[1px] bg-[#717171] mt-1"></div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-lg">No Transactions Found</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
