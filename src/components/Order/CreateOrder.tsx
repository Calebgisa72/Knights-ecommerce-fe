import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { createOrder } from '../../redux/actions/createOrderAction';
import toast from 'react-hot-toast';
import { PulseLoader } from 'react-spinners';
import { fetchCart } from '../../redux/actions/cartAction';

export type AddressData = {
  country: string;
  city: string;
  street: string;
};

const CreateOrder = () => {
  const districts = [
    'Bugesera',
    'Gatsibo',
    'Kayonza',
    'Kirehe',
    'Ngoma',
    'Nyagatare',
    'Rwamagana',
    'Gasabo',
    'Kicukiro',
    'Nyarugenge',
    'Burera',
    'Gakenke',
    'Gicumbi',
    'Musanze',
    'Rulindo',
    'Gisagara',
    'Huye',
    'Kamonyi',
    'Muhanga',
    'Nyamagabe',
    'Nyanza',
    'Nyaruguru',
    'Ruhango',
    'Karongi',
    'Ngororero',
    'Nyabihu',
    'Nyamasheke',
    'Rubavu',
    'Rutsiro',
    'Rusizi'
  ];

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<AddressData>();

  const dispatch = useDispatch<AppDispatch>();

  const onSubmit: SubmitHandler<AddressData> = (addressData: AddressData) => {
    addressData.country = 'Rwanda';
    if (!districts.includes(addressData.city)) {
      setError('city', {
        type: 'manual',
        message: 'Please select one of provided cities.'
      });
      return;
    }
    dispatch(createOrder(addressData));
  };

  const { createdOrder, loading, error } = useSelector((state: RootState) => state.createOrder);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000
      });
    }
    if (createdOrder) {
      toast.success('Your order has been created,\n Please proceed with payment!', {
        duration: 4000
      });
      dispatch(fetchCart());
    }
    reset();
  }, [error, createdOrder, dispatch, reset]);

  return (
    <div className="flex w-full items-center justify-center flex-col py-16">
      <div className=" w-full  p-8 border lg:w-[500px] shadow-lg rounded-xl gap-8 flex flex-col">
        <h1 className="text-xl font-semibold leading-5">Billing details</h1>
        <div className="flex justify-center py-8 w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="post"
            action="/test"
            className="flex flex-col gap-y-4 w-full "
          >
            <div className="flex flex-col w-full">
              <label htmlFor="">Country</label>
              <input
                type="text"
                value="Rwanda"
                className="text-[14px]  bg-neutral-100 text-neutral-600 border-[1px] p-3 rounded w-full"
                disabled
                {...register('country')}
              />
            </div>
            <div className="flex flex-col text-[.9rem] xmd:text-base">
              <label htmlFor="city">City</label>
              <select
                id="city"
                className="text-[12px] xmd:text-[15px] bg-baseWhite text-neutral-700 p-3 rounded border-[1px] border-neutral-300 cursor-pointer focus:outline-[1px] focus:outline focus:outline-neutral-400 "
                {...register('city', { required: true })}
              >
                <option value="">Select One</option>
                {districts.sort().map((city, index) => (
                  <option className=" cursor-pointer" value={city} key={city + index}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-500 text-[.7rem] mt-[-2px]">
                  {errors.city.message ? errors.city.message : 'City is required.'}
                </p>
              )}
            </div>
            <div className="flex flex-col  xmd:text-base">
              <label htmlFor="street">Street</label>
              <input
                type="text"
                id="street"
                placeholder="KK 249st | village"
                className="text-[12px] xmd:text-[15px] text-neutral-700 border-[1px] border-neutral-300 p-3 rounded focus:outline-[1px] focus:outline focus:outline-neutral-400 "
                {...register('street', { required: true })}
                disabled={createdOrder}
              />
              {errors.street && <p className="text-red-500 text-[.7rem] mt-[-2px]">Street is required.</p>}
            </div>
            <button
              type={loading || createdOrder ? 'button' : 'submit'}
              className={`${createdOrder ? 'bg-neutral-300 text-baseBlack cursor-not-allowed' : 'bg-primary text-baseWhite active:bg-[#182766]'} mt-5 font-medium rounded-lg px-8 py-4 text-[15px] xmd:text-base`}
            >
              {!loading && <span>Place Order</span>}
              {loading && <PulseLoader color="#fff" size={6} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
