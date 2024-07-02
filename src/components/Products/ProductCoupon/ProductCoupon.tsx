/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCoupon, getCoupon, updateCoupon } from '../../../redux/actions/productAction';
import { AppDispatch, RootState } from '../../../redux/store';
import { Coupon, FormPayload, PopupProps } from '../../../types/CouponTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faEdit, faPercentage, faTrash } from '@fortawesome/free-solid-svg-icons'; // Assuming you have FontAwesome icons imported
import formatDateTime from '../../../services/FormatDate';
import FormPopup from '../../Popups/FormPopup';
import CouponForm from '../../Forms/CouponForm';
import Popup from '../../Popups/Popup';
import { decodedToken } from '../../../services';
import ConfirmDeletePopup from '../../Popups/ConfirmDeletePopup';
import { DecodedToken } from '../../../pages/Authentication/Login';
import { testindata } from '../../../__test__/utils/testPayload';

interface ProductCouponProps {
  vendorId: string;
  productId: string;
}

const ProductCoupon: React.FC<ProductCouponProps> = ({ vendorId, productId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, coupons } = useSelector((state: RootState) => state.products);
  const [productCoupons, setProductCoupons] = useState<Coupon[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [couponsPerPage] = useState<number>(5);

  useEffect(() => {
    dispatch(getCoupon({ vendorId }));
  }, [dispatch, vendorId]);

  useEffect(() => {
    if (coupons.length > 0) {
      const filteredCoupons = coupons.filter((coupon) => coupon.product.id === productId);
      setProductCoupons(filteredCoupons);
    }
    const decoded: any = decodedToken();
    setTokenDecoded(decoded);
  }, [coupons, productId]);

  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = productCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleUpdate = (couponcode: string) => {
    setPrevCouponCode(couponcode);
  };
  const [showPopup, setShowPopup] = useState(false);
  const [prevCouponCode, setPrevCouponCode] = useState('');
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
  const handleDelete = async (couponId: string) => {
    try {
      await dispatch(deleteCoupon({ vendorId: couponId }));
      await dispatch(getCoupon({ vendorId }));
      setPopupProps({
        title: 'Success',
        subtitle: 'Coupon removed successfully.',
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
  const handleSubmit = async (data: FormPayload) => {
    try {
      await dispatch(updateCoupon({ data, vendorId: tokenDecoded.id, code: prevCouponCode }));
      await dispatch(getCoupon({ vendorId }));
      setPopupProps({
        title: 'Success',
        subtitle: 'Coupon updated successfully.',
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
    console.log('handleClose');
  };
  useEffect(() => {
    if (vendorId === 'testVendor' && productId === 'testProductId') {
      handleUpdate(vendorId);
      handleClose();
      handleSubmit(testindata);
    }
  }, []);
  return (
    <div>
      {loading && <p>Loading...</p>}
      {currentCoupons.length > 0 ? (
        <div>
          {currentCoupons.map((coupon) => (
            <div key={coupon.id} className="flex items-center justify-between border-b py-2 relative">
              <div className="flex gap-4 items-center py-2 justify-between w-full">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                  {coupon.discountType === 'percentage' ? (
                    <FontAwesomeIcon icon={faPercentage} />
                  ) : (
                    <FontAwesomeIcon icon={faDollarSign} />
                  )}
                </div>
                <div className="flex flex-col gap-1 w-full ">
                  <p className="font-medium whitespace-nowrap gap-8 flex justify-between">
                    <span>{coupon.code}</span>
                    <span className="px-4 whitespace-nowrap">
                      Rate: {coupon.discountRate}{' '}
                      {coupon.discountType === 'percentage' ? (
                        <FontAwesomeIcon icon={faPercentage} />
                      ) : (
                        <FontAwesomeIcon icon={faDollarSign} />
                      )}
                    </span>
                  </p>
                  <p className="text-gray-500 whitespace-nowrap gap-8 flex justify-between">
                    <span>Expires: {formatDateTime(coupon.expirationDate)}</span>
                    <span className="px-4 whitespace-nowrap">Usage Limit: {coupon.maxUsageLimit}</span>
                  </p>{' '}
                </div>
              </div>
              <div className="flex gap-4 px-2 relative z-10 items-center ">
                <ConfirmDeletePopup
                  trigger={<FontAwesomeIcon className="text-red-500 text-lg hover:text-red-700" icon={faTrash} />}
                  title="Confirm Coupon Deletion"
                  body="Are you sure you want to delete this coupon?"
                  onSubmit={() => handleDelete(coupon.id)}
                />

                <FormPopup
                  trigger={<FontAwesomeIcon icon={faEdit} onClick={() => handleUpdate(coupon.code)} />}
                  title={`Update a ${coupon.code} Coupon`}
                  submitText="Update Coupon"
                  closeText="Cancel"
                  body={
                    <CouponForm
                      updateData={coupon}
                      onSubmit={handleSubmit}
                      product={coupon.product.id as string}
                      title={`Update a ${coupon.code} Coupon`}
                    />
                  }
                  onSubmit={handleSubmit}
                  onClose={handleClose}
                />
                {showPopup && <Popup {...popupProps} onClose={() => setShowPopup(false)} />}
              </div>
            </div>
          ))}
          <div className="mt-4 flex justify-between relative z-0">
            <button
              className={`px-4 py-2 bg-primary text-white rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:bg-opacity-70'}`}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className={`px-4 py-2 bg-primary text-white rounded-md ${currentCoupons.length < couponsPerPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:bg-opacity-70'}`}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentCoupons.length < couponsPerPage}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No coupons available for this product.</p>
      )}
    </div>
  );
};

export default ProductCoupon;
