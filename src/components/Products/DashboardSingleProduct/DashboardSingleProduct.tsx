import { MoveLeft, Plus, SquarePen } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../redux/store';
import { createCoupon, fetchSingleProduct, getCoupon } from '../../../redux/actions/productAction';
import { useDispatch, useSelector } from 'react-redux';
import FormPopup from '../../Popups/FormPopup';
import CouponForm from '../../Forms/CouponForm';
import Popup from '../../Popups/Popup';
import { FormPayload, PopupProps } from '../../../types/CouponTypes';
import { decodedToken } from '../../../services/jwtOperation';
import ListPopup from '../../Popups/ListPopup';
import ProductCoupon from '../ProductCoupon/ProductCoupon';
import { DecodedToken } from '../../../pages/Authentication/Login';
import { expectedOutput } from '../../../__test__/utils/testPayload';

const DashboardSingleProduct: React.FC = () => {
  const { id, app_env } = useParams<{ id: string; app_env: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const { loading, product, error } = useSelector((state: RootState) => state.singleProduct);
  const [showPopup, setShowPopup] = useState(false);
  const [tokenDecoded, setTokenDecoded] = useState<DecodedToken>({
    id: '',
    email: '',
    role: '',
    iat: 0,
    exp: 0
  });
  const [popupProps, setPopupProps] = useState<PopupProps>({
    title: '',
    subtitle: '',
    responseType: 'success',
    duration: 3000,
    onClose: () => setShowPopup(false)
  });
  useEffect(() => {
    const decoded: any = decodedToken();
    if (!decoded && app_env) {
      const decode: any = decodedToken({ testData: expectedOutput });
      setTokenDecoded(decode);
    }
    setTokenDecoded(decoded);
  }, [app_env]);
  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [dispatch, id]);

  const handleSubmit = async (data: FormPayload) => {
    try {
      await dispatch(createCoupon({ data, vendorid: tokenDecoded?.id })).unwrap();
      await dispatch(getCoupon({ vendorId: tokenDecoded?.id })).unwrap();
      setPopupProps({
        title: 'Success',
        subtitle: 'Coupon created successfully.',
        responseType: 'success',
        duration: 3000,
        onClose: () => setShowPopup(false)
      });
      setShowPopup(true);
    } catch (error: any) {
      setPopupProps({
        title: 'Failure',
        subtitle: `${error.message}`,
        responseType: 'fail',
        duration: 3000,
        onClose: () => setShowPopup(false)
      });

      setShowPopup(true);
    }
  };
  const handleClose = () => {
    console.log('closed');
  };

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <div className="w-full my-8 flex flex-col items-center justify-center gap-8">
        <p className="py-2 px-4 bg-[#E7EBEF] rounded text-black ">The product is expired</p>
        <Link
          to={'/vendor/dashboard/products'}
          className="px-8 py-4 bg-[#070F2B] font-semibold text-white rounded-lg flex gap-4 items-center hover:scale-105 transition-all duration-300 ease-in-out w-max "
        >
          <MoveLeft /> Back
        </Link>
      </div>
    );

  return (
    <div className="flex bg-[#eef5ff] w-full h-full text-black p-8 flex-col items-start">
      <p className="font-bold text-base xmd:text-lg lg:text-xl leading-5">Product Details</p>
      <p className="text-neutral-600 text-[.75rem] lg:text-sm">
        <Link to={'/vendor/dashboard'}>Dashboard</Link> &gt; <Link to={'/vendor/dashboard/products'}>Products</Link>{' '}
        &gt; {product?.name}
      </p>
      <div className="bg-white border-[1px] border-neutral-300 rounded-xl mt-8 w-full p-8 flex flex-col gap-8">
        <Link
          to={`/vendor/dashboard/products/${id}/edit`}
          className="px-5 py-2 bg-[#070F2B] font-medium rounded-lg flex gap-2 items-center hover:scale-105 transition-all duration-300 ease-in-out w-max ml-auto text-[.77rem] xmd:text-[.82rem] lg:text-[.87rem] text-white"
        >
          <span className="leading-3">Update product</span>
          <SquarePen className="w-4" />
        </Link>
        <div className="flex gap-16 lg:flex-row flex-col justify-start">
          <div className="w-full lg:w-1/2 flex flex-col gap-2">
            <div className="w-full flex flex-col gap-2 mb-10">
              <p className="font-semibold text-lg mb-3">General Information</p>
              <div className="flex flex-col items-start gap-1">
                <p className="font-medium leading-3 text-[.82rem] xmd:text-[.86rem] lg:text-[.92rem]">Product Name</p>
                <p className="py-2 px-4 w-full bg-[#E7EBEF] rounded text-[.77rem] xmd:text-[.82rem] lg:text-[.87rem] text-neutral-800">
                  {product?.name}
                </p>
              </div>
              <div className="flex flex-col items-start gap-1">
                <p className="font-medium leading-3 text-[.82rem] xmd:text-[.86rem] lg:text-[.92rem]">Description</p>
                <div className="w-full bg-[#E7EBEF] rounded py-2 px-4 h-32 text-[.77rem] xmd:text-[.82rem] lg:text-[.87rem] text-neutral-800 overflow-scroll">
                  <p className="text-justify">{product?.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-1">
                <p className="font-medium leading-3 text-[.82rem] xmd:text-[.86rem] lg:text-[.92rem]">Category</p>
                <p className="py-2 px-4 w-full bg-[#E7EBEF] rounded text-[.77rem] xmd:text-[.82rem] lg:text-[.87rem] text-neutral-800">
                  {product?.categories.map((category) => category.name).join(' | ')}
                </p>
              </div>
              <div className="flex justify-between gap-4 w-full">
                <div className="flex flex-col items-start gap-1  w-full">
                  <p className="font-medium leading-3 text-[.82rem] xmd:text-[.86rem] lg:text-[.92rem]">Availability</p>
                  <p className="py-2 px-4 w-full bg-[#E7EBEF] rounded text-[.77rem] xmd:text-[.82rem] lg:text-[.87rem] text-neutral-800">
                    {product?.isAvailable ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-1  w-full">
                  <p className="font-medium leading-3 text-[.82rem] xmd:text-[.86rem] lg:text-[.92rem]">
                    Remaining quantity
                  </p>
                  <p className="py-2 px-4 w-full bg-[#E7EBEF] rounded text-[.77rem] xmd:text-[.82rem] lg:text-[.87rem] text-neutral-800">
                    {product?.quantity}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2 mb-8">
              <p className="font-semibold text-lg">Pricing</p>
              <div className="flex gap-4">
                <div className="flex flex-col items-start gap-1  w-full">
                  <p className="font-medium leading-3 text-[.82rem] xmd:text-[.86rem] lg:text-[.92rem]">Price</p>
                  <p className="py-2 px-4 w-full bg-[#E7EBEF] rounded text-[.77rem] xmd:text-[.82rem] lg:text-[.87rem] text-neutral-800">
                    {product?.newPrice}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-1  w-full">
                  <p className="font-medium leading-3 text-[.82rem] xmd:text-[.86rem] lg:text-[.92rem]">Old Price</p>
                  <p className="py-2 px-4 w-full bg-[#E7EBEF] rounded text-[.77rem] xmd:text-[.82rem] lg:text-[.87rem] text-neutral-800 h-full">
                    {product?.oldPrice}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-lg">Product Media</p>
              <div className="flex flex-col gap-1">
                <p className="font-medium leading-4 text-[.82rem] xmd:text-[.86rem] lg:text-[.92rem]">Product Images</p>
                <div className="grid grid-cols-2 gap-4">
                  {product?.images.map((image, index) => (
                    <img
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      className="object-cover rounded h-full"
                      key={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-2">
            <p className="font-semibold text-lg leading-normal mb-3 ">Discount</p>
            <div className="flex flex-col items-start gap-2">
              <p className="font-medium leading-3 text-[.82rem] xmd:text-[.86rem] lg:text-[.92rem]">Coupons</p>
              <ListPopup
                trigger={
                  <div className="py-2 px-4 w-full bg-[#E7EBEF] rounded text-[.77rem] xmd:text-[.82rem] lg:text-[.87rem] text-neutral-800 h-full">
                    List of coupons
                  </div>
                }
                title={`List of ${product?.name} coupons`}
                body={<ProductCoupon vendorId={tokenDecoded?.id} productId={id as string} />}
              />
              <div className="block">
                <FormPopup
                  trigger={
                    <button className="text-[.77rem] xmd:text-[.82rem] lg:text-[.87rem] py-2 px-4 bg-[#E7EBEF] font-medium text-black rounded-lg flex gap-1 items-center hover:scale-105 transition-all duration-300 ease-in-out">
                      <span>Create New Coupon</span>
                      <Plus className="w-5" />
                    </button>
                  }
                  title="Create a Coupon"
                  submitText="Add Coupon"
                  closeText="Cancel"
                  body={<CouponForm onSubmit={handleSubmit} product={id as string} title={'Create a Coupon'} />}
                  onSubmit={handleSubmit}
                  onClose={handleClose}
                />

                {showPopup && <Popup {...popupProps} onClose={() => setShowPopup(false)} />}
              </div>
            </div>
            <div className="flex flex-col mt-8">
              <p className="font-semibold text-lg">Customer Feedback</p>
              <div className="flex gap-4 flex-col py-3">
                {product?.feedbacks && product?.feedbacks.length > 0 ? (
                  product.feedbacks.map((feedback, index) => (
                    <div className="flex gap-5" key={index}>
                      <img
                        className="w-[70px] h-[70px] rounded-full border border-black"
                        src="https://unsplash.com/photos/a-row-of-parked-cars-on-a-city-street-GxlHugQRrog"
                        alt="Feedback"
                      />
                      <div className="flex flex-col gap-2">
                        <p className="font-bold ">{feedback?.name}</p>
                        <p>{feedback?.description}</p>
                        <p className="text-[#7c7c7c]">{feedback?.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-2 px-4 w-full bg-[#E7EBEF] rounded text-[.77rem] xmd:text-[.82rem] lg:text-[.87rem] text-neutral-800">
                    No feedbacks for this product
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSingleProduct;
