import { ListFilter, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import searchIcon from '/search.svg';
import { Link } from 'react-router-dom';
import ProductsCard from '../ProductCard/ProductsCard';
import { AppDispatch, RootState } from '../../../redux/store';
import { fetchVendorProducts } from '../../../redux/actions/productAction';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../../../types/productTypes';

const DashboardProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const dispatch = useDispatch<AppDispatch>();
  const { loading, products, error } = useSelector((state: RootState) => state.getVendorProduct);

  useEffect(() => {
    dispatch(fetchVendorProducts());
  }, [dispatch]);

  const getExpiredProductsCount = (products: Product[]): number => {
    const currentDate = new Date();
    return products?.filter((product) => {
      const expirationDate = new Date(product.expirationDate);
      return expirationDate < currentDate;
    }).length;
  };

  const expiredProductsCount = products ? getExpiredProductsCount(products.data.products) : 0;

  const filteredProducts = products?.data?.products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.categories.some((category) => category.name.toLowerCase().includes(searchTerm))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by createdAt in descending order

  return (
    <div className="flex flex-col bg-[#EEF5FF] w-full h-full text-black p-8 gap-8 ">
      <div className="flex gap-4 justify-between">
        <div>
          <h1 className="font-bold text-2xl ">All Products</h1>
          <p>
            <Link to={'/vendor/dashboard'}>Dashboard</Link> &gt; <Link to={'/vendor/dashboard/products'}>Products</Link>
          </p>
        </div>
        <Link
          to={'new'}
          className="px-8 py-4 bg-[#070F2B] font-semibold text-white rounded-lg flex gap-4 items-center hover:scale-105 transition-all duration-300 ease-in-out"
        >
          New Product
          <Plus />
        </Link>
      </div>
      <div className="flex gap-8">
        <div className="flex flex-col items-center  bg-[#070F2B] text-white py-6 w-full rounded-xl gap-8">
          <p className="font-semibold text-lg">Total Products</p>
          <div className="flex gap-4 items-center">
            <p className="font-bold text-6xl pr-4 border-r-2 border-white">
              {products?.data?.products ? products.data.products.length : '0'}
            </p>
            <p>{expiredProductsCount} Expired</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-start bg-white text-black py-6 w-full rounded-xl border-2 gap-8">
          <p className="font-semibold text-lg">Products Sold Out</p>
          <div className="flex gap-4">
            <p className="font-bold text-6xl">40</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 p-6 rounded-xl bg-white border-2 ">
        <div className="flex gap-4 ml-auto">
          <div className="flex px-4 py-2 rounded-lg border border-[#d1d1d1] gap-2">
            <img src={searchIcon} />
            <input
              type="text"
              className="bg-white md:w-[300px] outline-none"
              placeholder="Search by Name, Category.."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button className="flex gap-2 items-center p-4 rounded-lg bg-[#070F2B] text-white">
            Filter <ListFilter />
          </button>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
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
