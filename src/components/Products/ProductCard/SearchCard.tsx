import React from 'react';
import { Link } from 'react-router-dom';

export interface Product {
  id: string;
  name: string;
  price: number;
  owner: string;
  image: string;
}

interface ProductProps {
  productList: Product[];
}

const SearchCard: React.FC<ProductProps> = ({ productList }) => {
  return (
    <>
      {productList.map((product) => (
        <Link key={product.id} to={`/product/${product.id}`}>
          <div className="group cursor-pointer flex flex-col gap-y-2 w-[15.6rem] text-sm hover:bg-neutral-200 p-2 rounded relative duration-200">
            <div className="sm:w-full sm:flex md:hidden absolute right-4 top-4 bg-baseWhite w-8 h-8 pt-[2px] justify-center xmd:items-center text-center rounded-full">
              <i className="fa-solid fa-heart text-lg text-orange"></i>
            </div>
            <div className="bg-neutral-400 h-[19.5rem]">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="text-neutral-600">
              <p>{product.name}</p>
            </div>
            <br />
            <p className="text-lg">{product.owner}</p>
            <p className="text-lg text-orange">RWF {product.price}</p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default SearchCard;
