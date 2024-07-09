import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Product } from '../../types/productTypes';

interface ProductBreadcrumbsProps {
  item: Product;
}

function ProductBreadcrumbs({ item }: ProductBreadcrumbsProps) {
  return (
    <div className="hidden w-full sm:flex items-center justify-start text-grey4 font-poppins font-normal overflow-hidden whitespace-nowrap text-ellipsis">
      <p>Home</p>
      <ChevronRight strokeWidth={1} height={20} />
      <p>Collections</p>
      <ChevronRight strokeWidth={1} height={20} />
      <p>
        {item?.vendor?.firstName} {item?.vendor?.lastName}
      </p>
      <ChevronRight strokeWidth={1} height={20} />
      <p className="overflow-hidden whitespace-nowrap text-ellipsis">{item?.name}</p>
    </div>
  );
}

export default ProductBreadcrumbs;
