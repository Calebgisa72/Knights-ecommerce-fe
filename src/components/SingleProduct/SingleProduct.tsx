import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { addFeedback, fetchSingleProduct } from '../../redux/actions/productAction';
import SingleProductSkeletonLoader from './SingleProductSkeletonLoader';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Minus, Plus, Star } from 'lucide-react';
import ProductBreadcrumbs from '../Breadcrumbs/ProductBreadcrumbs';
import { AddToCartData } from '../../types/cartTypes';
import { addToCart } from '../../redux/actions/cartAction';
import { BeatLoader } from 'react-spinners';
import FeedbackForm from '../Forms/FeedbackForm';
import Popup from '../Popups/Popup';
import { FeedbackPayload } from '../../types/FeedbackTypes';
import { PopupProps } from '../../types/CouponTypes';
import { deleteFeedback, GetOrders, UpdateFeedback } from '../../redux/actions/OrdersAction';

import FeedbackFormPopup from '../Popups/FeedbackFormPopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
// eslint-disable-next-line react-refresh/only-export-components
export function triggerUpdateFeedback(dispatch: AppDispatch, feedbackId: string, data: any, productId: string) {
  dispatch(UpdateFeedback({ feedbackId, data })).then(() => {
    dispatch(fetchSingleProduct(productId));
  });
  dispatch(deleteFeedback({ feedbackId })).then(() => {
    dispatch(fetchSingleProduct(productId));
  });
}
function SingleProduct() {
  const { id } = useParams<{ id: string }>();
  const [isVisible, setIsVisible] = useState(false);
  const [visible, setVisible] = useState('false');

  const openFormPopup = (openForm: string) => {
    setIsVisible(!isVisible);
    setVisible(openForm);
  };

  const dispatch = useDispatch<AppDispatch>();

  const { product, loading, error } = useSelector((state: RootState) => state.singleProduct);
  const { orders } = useSelector((state: RootState) => state.buyerOrders);
  const { userToken } = useSelector((state: RootState) => state.auth);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [popupProps, setPopupProps] = useState<PopupProps>({
    title: '',
    subtitle: '',
    responseType: 'success',
    duration: 3000,
    onClose: () => setShowPopup(false)
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);

  const handleIncrement = () => {
    setProductQuantity((prev) => prev + 1);
  };

  const handleUpdate = async (data: any) => {
    dispatch(UpdateFeedback({ feedbackId: data?.id, data })).then(() => {
      handleGetProduct();
    });
    setIsVisible(false);
    setVisible('');
  };

  const handleDecrement = () => {
    if (productQuantity > 0) {
      setProductQuantity((prev) => prev - 1);
    }
  };

  const { loading: addToCartloading, error: addToCartError } = useSelector((state: RootState) => state.cart);

  const handleAddToCart = () => {
    const data: AddToCartData = {
      productId: product?.id,
      quantity: productQuantity
    };

    dispatch(addToCart(data));

    if (addToCartError) {
      toast.error(addToCartError);
    }

    if (!addToCartloading && !addToCartError) {
      setTimeout(() => {
        toast.success('Product added to cart');
      }, 5000);
    }
  };

  useEffect(() => {
    dispatch(fetchSingleProduct(id as string));
    dispatch(GetOrders());
  }, [dispatch, id]);
  useEffect(() => {
    if (orders) {
      const foundOrder = orders.find((order) => order.orderItems.some((item) => item.product.id === id));
      if (foundOrder) {
        setOrderId(foundOrder.id);
      }
    }
  }, [orders, id]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  useEffect(() => {
    if (addToCartError) {
      toast.error(addToCartError);
    }
  }, [addToCartError]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };
  const handleGetProduct = async () => {
    await dispatch(fetchSingleProduct(id as string));
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    dispatch(deleteFeedback({ feedbackId })).then(() => {
      handleGetProduct();
      setIsVisible(false);
      setVisible('');
    });
  };
  const formattedDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    if (inputRef.current) {
      const length = productQuantity.toString().length;
      inputRef.current.style.width = `${Math.max(length * 10, 15)}px`;
    }
  }, [productQuantity]);

  const handleSubmit = async (data: FeedbackPayload) => {
    setOrderId(orderId);
    try {
      await dispatch(addFeedback({ data, productId: id as string })).then((response) => {
        if (response.payload.type) {
          toast.error(response.payload.data.message, {
            duration: 7000,
            style: { maxWidth: '360px', fontSize: '.9rem' }
          });
        } else {
          toast.success(response.payload.message);
        }
        dispatch(fetchSingleProduct(id as string));
      });
    } catch (error: any) {
      setPopupProps({
        title: 'Failure',
        subtitle: `${error}`,
        responseType: 'fail',
        duration: 5000,
        onClose: () => setShowPopup(false)
      });

      setShowPopup(true);
    }
  };
  const handleClose = () => {
    console.log('closed');
  };

  const [showAllReviews, setShowAllReviews] = useState(false);
  const toggleShowAllReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  return (
    <>
      {loading ? (
        <SingleProductSkeletonLoader />
      ) : (
        product !== null && (
          <div className="h-auto w-full p-10 flex items-start justify-center">
            <div className="w-[80vw] flex flex-col items-center justify-start gap-y-4">
              <ProductBreadcrumbs item={product} />

              <div className="w-full flex flex-col sm:flex-row items-start justify-start gap-x-5">
                <div className="w-full sm:w-auto flex flex-col-reverse sm:flex-row items-start justify-start gap-x-4">
                  <div className="h-[65px] sm:h-[450px] w-[100%] sm:w-[85px] flex flex-row sm:flex-col items-center justify-start gap-x-3 sm:gap-y-3 px-0.5 overflow-x-auto overflow-y-hidden sm:overflow-x-hidden sm:overflow-y-auto mt-4 sm:mt-0">
                    {product?.images?.map((image, index) => (
                      <div
                        className="min-w-[80px] sm:w-full h-[50px] sm:h-[100px] shadow-prodImage cursor-pointer"
                        key={index}
                        onClick={() => handleImageClick(image)}
                      >
                        <img src={image} alt="thumbnail " className="h-full w-full object-cover" role="testRole" />
                      </div>
                    ))}
                  </div>
                  <div className="h-[450px] w-full sm:w-[375px] shadow-prodImage">
                    <img
                      src={selectedImage as string}
                      alt="main image"
                      className="h-full w-full object-cover"
                      role="main image"
                    />
                  </div>
                  <div className="sm:hidden w-full flex items-center justify-start text-primary">
                    <h1 className="font-medium text-2xl sm:text-3xl font-poppins mb-2">{product?.name}</h1>
                  </div>
                </div>

                <div className="w-full h-auto sm:h-[450px] flex flex-col items-start justify-start sm:justify-between gap-y-1">
                  <div className="w-full flex flex-col items-start justify-start gap-y-2 mt-5 sm:mt-0">
                    <div className="hidden w-full sm:flex items-center justify-start text-primary">
                      <h1 className="font-medium text-2xl sm:text-3xl font-poppins">{product?.name}</h1>
                    </div>
                    <div className="w-full flex items-center justify-start text-orange gap-x-1.5">
                      <Star fill="#FF4141" strokeWidth={1} />
                      <Star fill="#FF4141" strokeWidth={1} />
                      <Star fill="#FF4141" strokeWidth={1} />
                      <Star fill="#FF4141" strokeWidth={1} />
                      <Star fill="#FF4141" fillOpacity={0.5} />{' '}
                      <p className="text-primary text-md font-thin font-poppins">({product?.feedbacks?.length})</p>
                    </div>
                    <div className="w-full flex items-center justify-start mt-8 gap-x-3">
                      {product?.oldPrice !== null && parseInt(product?.oldPrice) > parseInt(product?.newPrice) && (
                        <p className="font-poppins font-medium text-2xl text-grey2 line-through">
                          RWF{parseInt(product?.oldPrice).toLocaleString()}
                        </p>
                      )}

                      <p className="font-poppins font-medium text-2xl text-orange">
                        RWF{parseInt(product?.newPrice).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="w-full flex flex-col items-center sm:items-start justify-center sm:justify-start gap-y-2">
                    <div className="w-full flex items-center justify-start text-primary mt-4 sm:mt-0">
                      <p className="w-full text-center sm:text-left font-poppins font-medium text-xl sm:text-base">
                        Quantity
                      </p>
                    </div>
                    <div className="w-[80%] sm:w-auto flex items-center justify-center sm:justify-start px-3 py-1.5 text-grey5 border-[1.5px] border-grey5 gap-x-4 font-poppins font-medium mb-0 sm:mb-3">
                      <Minus strokeWidth={2} className="cursor-pointer" onClick={handleDecrement} />
                      <input
                        ref={inputRef}
                        type="text"
                        className="outline-none w-[15px] border-none text-center font-poppins font-normal text-base text-grey5"
                        value={productQuantity}
                        onChange={(e) => setProductQuantity(parseInt(e.target.value) || 0)}
                      />
                      <Plus strokeWidth={2} className="cursor-pointer" onClick={handleIncrement} />
                    </div>
                    <button
                      className={`flex items-center justify-center w-full sm:w-[180px] h-[45px] bg-primary text-white font-poppins font-medium text-base border border-primary mt-2 ${productQuantity === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      disabled={productQuantity === 0}
                      onClick={handleAddToCart}
                    >
                      {addToCartloading ? <BeatLoader color="#ffffff" /> : 'Add to Cart'}
                    </button>
                    {userToken && orderId && (
                      <div className="block">
                        <FeedbackFormPopup
                          trigger={
                            <button
                              className="flex w-full items-center justify-center sm:w-[180px] h-[45px] bg-[#E7EBEF] font-semibold text-black rounded-lg hover:scale-105 transition-all duration-300 ease-in-out"
                              role="feedback-button"
                            >
                              <span>Feedback</span>
                              <Plus className="w-5" />
                            </button>
                          }
                          title="Share with us your review"
                          submitText="Submit Review"
                          closeText="Cancel"
                          body={
                            <FeedbackForm
                              onSubmit={handleSubmit}
                              orderId={orderId}
                              title={'Share with us your review'}
                            />
                          }
                          onSubmit={handleSubmit}
                          onClose={handleClose}
                        />

                        {showPopup && <Popup {...popupProps} onClose={() => setShowPopup(false)} />}
                      </div>
                    )}
                    <div className="w-full flex items-center justify-start gap-x-1 mt-4 sm:mt-0">
                      <p className="font-poppins font-semibold text-primary text-lg sm:text-base">Category:</p>
                      <p className="font-poppins font-normal text-grey2 text-lg sm:text-base capitalize">
                        {product?.categories.map((category) => category.name).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-start justify-start gap-y-2 mt-4 sm:mt-6">
                <div className="w-full flex items-center justify-center sm:justify-start text-primary">
                  <h1 className="font-medium text-xl sm:text-3xl font-poppins">Product Description</h1>
                </div>
              </div>

              <div className="w-full flex flex-col items-start justify-start mt-2 sm:mt-4">
                <div className="w-full flex items-center justify-start text-grey4">
                  {
                    <p className="text-sm font-light sm:font-normal sm:text-base font-poppins">
                      {product?.description}
                    </p>
                  }
                </div>
              </div>
              <div className="container w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews ({product?.feedbacks?.length})</h2>

                {product?.feedbacks.slice(0, showAllReviews ? product?.feedbacks?.length : 5).map((feedback: any) => (
                  <div key={feedback.id} className="mb-6 flex flex-col gap-2 border p-4">
                    <div className="flex items-center">
                      <img
                        src={
                          feedback?.user?.photoUrl ??
                          `https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=40`
                        }
                        alt="User"
                        className="rounded-full w-8 h-8 mr-2"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {feedback?.user?.firstName} {feedback?.user?.lastName}
                        </h3>
                        <span className="text-gray-500 text-sm">{formattedDate(feedback?.createdAt)}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-base ">{feedback?.comment}</p>
                    <div className="flex space-x-2">
                      <h2 onClick={() => openFormPopup(feedback.id)} className="text-blue-500">
                        Update
                      </h2>
                      <ConfirmDeletePopup feedback={feedback} onDelete={handleDeleteFeedback} />
                    </div>
                    {isVisible && visible === feedback.id && (
                      <FeedbackForm
                        title="Update your review"
                        onSubmit={handleUpdate}
                        updateData={feedback}
                        orderId={feedback.id}
                      />
                    )}
                  </div>
                ))}

                {!showAllReviews && (
                  <button
                    onClick={toggleShowAllReviews}
                    className="text-blue-500 font-medium hover:underline focus:outline-none"
                    data-testid="see-all-reviews-button"
                  >
                    See all reviews
                  </button>
                )}

                {showAllReviews && (
                  <button
                    onClick={toggleShowAllReviews}
                    className="text-blue-500 font-medium hover:underline focus:outline-none"
                  >
                    Hide reviews
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}

export default SingleProduct;
