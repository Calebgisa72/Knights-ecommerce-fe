import { ListFilter, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import searchIcon from '/search.svg';
import { Link } from 'react-router-dom';
import ProductsCard from '../ProductCard/ProductsCard';
import { AppDispatch, RootState } from '../../../redux/store';
import { fetchVendorProducts } from '../../../redux/actions/productAction';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../../../types/productTypes';
import { numFormat } from '../../../utils/numberFormat';

const DashboardProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [soldOutProduct, setSoldOutProduct] = useState(0);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const dispatch = useDispatch<AppDispatch>();
  const { loading, products, error } = useSelector((state: RootState) => state.getVendorProduct);

  useEffect(() => {
    dispatch(fetchVendorProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products?.data.products.length) {
      let soldOut = 0;
      products?.data.products.forEach((product) => {
        if (product.quantity < 1) {
          soldOut++;
        }
      });
      setSoldOutProduct(soldOut);
    }
  }, [products]);

  const getExpiredProductsCount = (products: Product[]): number => {
    const currentDate = new Date();
    return products?.filter((product) => {
      if (product.expirationDate) {
        const expirationDate = new Date(product.expirationDate);
        return expirationDate < currentDate;
      }
      return false;
    }).length;
  };

  const expiredProductsCount = products ? getExpiredProductsCount(products.data.products) : 0;

  const filteredProducts = products?.data?.products
    ?.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.categories.some((category) => category.name.toLowerCase().includes(searchTerm))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by createdAt in descending order

  return (
    <div className="flex flex-col bg-[#EEF5FF] w-full h-full text-black py-8 px-4 lg:px-10 2xl:px-20 gap-8 ">
      <div className="flex gap-4 justify-between">
        <div>
          <h1 className="font-bold text-base xmd:text-lg lg:text-xl">All Products</h1>
          <p className="flex gap-x-1 items-center text-neutral-600 text-[.75rem] lg:text-sm leading-3">
            <Link to={'/vendor/dashboard'}>Dashboard</Link> &gt; <Link to={'/vendor/dashboard/products'}>Products</Link>
          </p>
        </div>
        <Link
          to={'/vendor/dashboard/products/new'}
          className="px-3 py-1 md:px-4 md:py-1 text-[.8rem] xmd:text-sm lg:text-[.9rem] bg-[#070F2B] font-medium text-white rounded-lg flex gap-1 items-center hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <span>New Product</span>
          <Plus className="w-4" />
        </Link>
      </div>
      <div className="flex gap-2 xmd:gap-5 lg:gap-10">
        <div className="flex flex-col items-center  bg-[#070F2B] text-white py-6 w-full rounded-xl gap-y-2 md:gap-y-4 lg:gap-y-6">
          <p className="font-semibold text-[.9rem] md:text-[.95rem] tracking-tight xmd:tracking-normal">
            Total Products
          </p>
          <div className="flex gap-2 items-center">
            <p className="text-[1.8rem] xmd:text-[2.8rem] lg:text-[3.5rem] font-sans leading-9 font-medium pr-2 border-r-2 tracking-tight border-white">
              {products?.data?.products ? products.data.products.length : '0'}
            </p>
            <p className="text-[.8rem] lg:text-[.85rem]">{expiredProductsCount} Expired</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-start bg-white text-black py-6 w-full rounded-xl border-2 gap-y-2 md:gap-y-4 lg:gap-y-6">
          <p className="font-semibold tracking-tight xmd:tracking-normal text-[.9rem] md:text-[.95rem]">
            Products Sold Out
          </p>
          <div className="flex gap-4">
            <p className="text-[1.8rem] xmd:text-[2.8rem] lg:text-[3.8rem] font-sans leading-10 font-medium">
              {numFormat(soldOutProduct)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 p-4 rounded-xl bg-white border-2 ">
        <div className="flex gap-x-2 xmd:gap-x-6 justify-end text-[.7rem] lg:text-sm text-nowrap">
          <div className="flex items-center gap-x-1 border focus-within:border-neutral-900 border-neutral-400 rounded-lg py-[.35rem] pl-3 pr-3 xmd:pr-12 overflow-hidden">
            <img src={searchIcon} alt="search-icon" className="w-4 lg:w-5" />
            <input
              type="text"
              className="bg-white md:w-[300px] outline-none"
              placeholder="Search by Name, Category.."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button className="flex items-center justify-center py-[.3rem] gap-x-2 px-3 bg-primary text-white rounded-md">
            Filter <ListFilter />
          </button>
        </div>
        <div className="grid justify-center xmd:grid-cols-2 xl:grid-cols-3 gap-y-6 xmd:gap-4 lg:gap-8">
          {error && <p className="py-2 px-4 bg-[#E7EBEF] rounded text-black ">Something went wrong please try again</p>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            filteredProducts?.map((product) => <ProductsCard data={product} key={product.id} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardProducts;
