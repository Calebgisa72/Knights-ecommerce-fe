import React, { useEffect, useState } from 'react';
import CategoriesMenu from '../../components/Menu/CategoriesMenu';
import ClientProductCard, { ProductProp } from '../../components/Products/ProductCard/ClientProductCard';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import HeroSection from '../../components/Banners/HeroSection';
import { setBanners, setCurrentBanner } from '../../redux/reducers/bannerReducer';
import { FormatPosted, calculateRate } from '../../utils/bannerRateTime';
import Banner from '../../components/Banners/Banner';
import { PropagateLoader } from 'react-spinners';
import { useSwipeable } from 'react-swipeable';
import BannerIdentifier from '../../components/Banners/BannerIdentifier';
import fetchWishlist from '../../utils/wishlistFunctions/fetchWishlist';

const Home = () => {
  const [productList, setProductList] = useState<ProductProp[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<JSX.Element[]>([]);
  const [viewProducts, setViewProducts] = useState<JSX.Element[]>([]);
  const [viewItems, setViewItems] = useState(12);
  const { currentCategory } = useSelector((state: RootState) => state.category);
  const { banners, currentBanner } = useSelector((state: RootState) => state.banner);
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanners] = useState<JSX.Element[]>([]);
  const [dotIdentifies, setDotIdentifiers] = useState<JSX.Element[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { userToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/product/all`)
      .then((response) => {
        const products: ProductProp[] = response.data.data.products;
        if (products) {
          setProductList(
            products.filter((product) => {
              return (
                product.vendor.status === 'active' &&
                Number(product.quantity) > 0 &&
                (!product.expirationDate || new Date(product.expirationDate) > new Date())
              );
            })
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const productCards = [];
    for (let i = 0; i < productList.length; i++) {
      if (!currentCategory) {
        productCards.push(<ClientProductCard product={productList[i]} key={i} />);
      }
      if (currentCategory) {
        for (let j = 0; j < productList[i].categories.length; j++) {
          if (currentCategory.toLowerCase() === productList[i].categories[j].name.toLowerCase()) {
            productCards.push(<ClientProductCard product={productList[i]} key={i} />);
          }
        }
      }
    }
    if (productCards) {
      setSelectedProducts(productCards);
    }
  }, [currentCategory, productList, viewItems]);

  useEffect(() => {
    const tempBanners = [];
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].oldPrice) {
        const result = calculateRate(productList[i].newPrice, productList[i].oldPrice!);
        if (result) {
          const time = FormatPosted(new Date(productList[i].updatedAt));
          tempBanners.push({
            rate: result,
            time: time,
            title: productList[i].name,
            id: productList[i].id,
            image: productList[i].images[0]
          });
        }
      }
    }

    tempBanners.length && dispatch(setBanners(tempBanners));
  }, [dispatch, productList]);

  useEffect(() => {
    let productCards;
    if (selectedProducts.length >= viewItems) {
      productCards = selectedProducts.slice(0, viewItems);
    } else {
      productCards = selectedProducts;
    }
    setViewProducts(productCards);
  }, [viewItems, selectedProducts]);

  const handleAddMore = () => {
    setViewItems((prevViewItems) => prevViewItems + 4);
  };

  useEffect(() => {
    const bannerElements: JSX.Element[] = [];
    const bannerIdentifiers: JSX.Element[] = [];
    banners.forEach((banner, index) => {
      bannerElements.push(<Banner rate={banner.rate} time={banner.time} id={banner.id} image={banner.image} />);
      bannerIdentifiers.push(<BannerIdentifier key={index} index={index + 1} />);
    });
    setDotIdentifiers(bannerIdentifiers);
    banners.length > 0 && setSelectedBanners(bannerElements);
    const intervalIdentifier = setInterval(() => {
      if (banners.length > currentBanner) {
        dispatch(setCurrentBanner(currentBanner + 1));
      } else {
        dispatch(setCurrentBanner(0));
      }
    }, 10000);
    return () => clearInterval(intervalIdentifier);
  }, [banners, currentBanner, dispatch]);

  const handleSwipedLeft = () => {
    if (currentBanner < banners.length) {
      dispatch(setCurrentBanner(currentBanner + 1));
    }
  };

  useEffect(() => {
    if (userToken) {
      const fetchData = async () => {
        try {
          await fetchWishlist(userToken, dispatch);
        } catch (error) {
          console.error('Failed to fetch wishlist', error);
        }
      };

      fetchData();
    }
  }, [userToken, dispatch]);

  const handleSwipedRight = () => {
    if (currentBanner > 0) {
      dispatch(setCurrentBanner(currentBanner - 1));
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipedLeft,
    onSwipedRight: handleSwipedRight
  });

  return (
    <div className="relative text-baseBlack">
      <div className="hidden xmd:flex">
        <CategoriesMenu />
      </div>
      <div>
        <div className="relative group overflow-hidden" {...swipeHandlers}>
          <div className="group-hover:flex hidden z-10 animate-fadeInAnimation absolute top-[45%] left-[50px]">
            {window.innerWidth > 700 && (
              <i
                onClick={handleSwipedRight}
                className={`cursor-pointer fa-solid text-4xl fa-square-caret-left ${currentBanner === 0 ? 'hidden' : 'block'} text-primary hover:text-blue-900`}
              ></i>
            )}
          </div>

          <div className="group-hover:block hidden animate-fadeInAnimation z-10 absolute top-[45%] right-[50px]">
            {window.innerWidth > 700 && (
              <i
                onClick={handleSwipedLeft}
                className={`cursor-pointer fa-solid text-4xl fa-square-caret-right ${currentBanner === banners.length ? 'hidden' : 'block'} text-primary hover:text-blue-900`}
              ></i>
            )}
          </div>
          <div>{currentBanner === 0 && <HeroSection />}</div>
          <div className="flex w-[100%] justify-center">{currentBanner > 0 && selectedBanner[currentBanner - 1]}</div>
        </div>

        <div className="w-[100%] flex h-5 mt-[10px] mb-[-8px] items-center justify-center gap-2">
          <div
            onClick={() => dispatch(setCurrentBanner(0))}
            className={`${currentBanner === 0 ? 'w-[8px] h-[8px] bg-grey2' : 'w-[5px] h-[5px] bg-grey1'} rounded-full cursor-pointer`}
          ></div>
          {dotIdentifies}
        </div>
      </div>
      <div className="flex flex-col items-center justify-around gap-y-8 py-8 xmd:px-8 lg:px-16" id="products">
        <h1 className="text-2xl font-medium">Explore our collections</h1>

        {loading && (
          <div className="w-full flex justify-center px-6 py-20" data-testid="loading-spinner">
            <PropagateLoader color="#070f2b" />
          </div>
        )}

        {!loading && (
          <div className="w-full flex gap-y-10 justify-center flex-wrap gap-x-5 px-6 xmd:px-0">
            {viewProducts.length > 0 ? viewProducts : `${currentCategory} Products sold out !! Come back later`}
          </div>
        )}
      </div>
      {selectedProducts.length > viewItems && (
        <div className="w-full flex items-center justify-center p-12">
          <button
            onClick={handleAddMore}
            className="w-[250px] flex justify-center gap-x-3 items-center rounded-3xl min-h-[50px] ml-1 text-primary border  border-primary hover:bg-gray-100"
          >
            Load more products
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
