import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchSingleProduct } from '../../redux/actions/productAction';
import SingleProductSkeletonLoader from './SingleProductSkeletonLoader';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Minus, Plus, Star } from 'lucide-react';
import ProductBreadcrumbs from '../Breadcrumbs/ProductBreadcrumbs';
import { AddToCartData } from '../../types/cartTypes';
import { addToCart } from '../../redux/actions/cartAction';
import { BeatLoader } from 'react-spinners';

function SingleProduct() {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();

  const { product, loading, error } = useSelector((state: RootState) => state.singleProduct);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);

  const handleIncrement = () => {
    setProductQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (productQuantity > 0) {
      setProductQuantity((prev) => prev - 1);
    }
  };

  const { loading: addToCartloading, error: addToCartError } = useSelector((state: RootState) => state.cart);

  const handleAddToCart = () => {
    const data: AddToCartData = {
      productId: product!.id,
      quantity: productQuantity
    };

    dispatch(addToCart(data));

    if (addToCartError) {
      toast.error(addToCartError);
    }

    if (!addToCartloading && !addToCartError) {
      toast.success('Product added to cart');
    }
  };

  useEffect(() => {
    dispatch(fetchSingleProduct(id as string));
  }, [dispatch, id]);

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

  useEffect(() => {
    if (inputRef.current) {
      const length = productQuantity.toString().length;
      inputRef.current.style.width = `${Math.max(length * 10, 15)}px`;
    }
  }, [productQuantity]);

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
                    {product.images.map((image, index) => (
                      <div
                        className="min-w-[80px] sm:w-full h-[50px] sm:h-[100px] shadow-prodImage cursor-pointer"
                        key={index}
                        onClick={() => handleImageClick(image)}
                      >
                        <img src={image} alt="" className="h-full w-full object-cover" role="testRole" />
                      </div>
                    ))}
                  </div>
                  <div className="h-[450px] w-full sm:w-[375px] shadow-prodImage">
                    <img src={selectedImage as string} alt="" className="h-full w-full object-cover" role="testRole" />
                  </div>
                  <div className="sm:hidden w-full flex items-center justify-start text-primary">
                    <h1 className="font-medium text-2xl sm:text-3xl font-poppins mb-2">{product.name}</h1>
                  </div>
                </div>

                <div className="w-full h-auto sm:h-[450px] flex flex-col items-start justify-start sm:justify-between gap-y-1">
                  <div className="w-full flex flex-col items-start justify-start gap-y-2 mt-5 sm:mt-0">
                    <div className="hidden w-full sm:flex items-center justify-start text-primary">
                      <h1 className="font-medium text-2xl sm:text-3xl font-poppins">{product.name}</h1>
                    </div>
                    <div className="w-full flex items-center justify-start text-orange gap-x-1.5">
                      <Star fill="#FF4141" strokeWidth={1} />
                      <Star fill="#FF4141" strokeWidth={1} />
                      <Star fill="#FF4141" strokeWidth={1} />
                      <Star fill="#FF4141" strokeWidth={1} />
                      <Star fill="#FF4141" fillOpacity={0.5} />{' '}
                      <p className="text-primary text-md font-thin font-poppins">({product.feedbacks.length})</p>
                    </div>
                    <div className="w-full flex items-center justify-start mt-8 gap-x-3">
                      {product.oldPrice !== null && parseInt(product.oldPrice) > parseInt(product.newPrice) && (
                        <p className="font-poppins font-medium text-2xl text-grey2 line-through">
                          RWF{parseInt(product.oldPrice).toLocaleString()}
                        </p>
                      )}

                      <p className="font-poppins font-medium text-2xl text-orange">
                        RWF{parseInt(product.newPrice).toLocaleString()}
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
                    <div className="w-full flex items-center justify-start gap-x-1 mt-4 sm:mt-0">
                      <p className="font-poppins font-semibold text-primary text-lg sm:text-base">Category:</p>
                      <p className="font-poppins font-normal text-grey2 text-lg sm:text-base">
                        {product.categories[0].name}
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
                  {<p className="text-sm font-light sm:font-normal sm:text-base font-poppins">{product.description}</p>}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}

export default SingleProduct;
