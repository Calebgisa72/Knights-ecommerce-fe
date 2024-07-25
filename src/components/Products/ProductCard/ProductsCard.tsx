import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { deleteProduct } from '../../../redux/actions/productAction';
import toast from 'react-hot-toast';
interface ProductsCardProps {
  data: {
    id: string;
    name: string;
    description: string;
    images: string[];
    newPrice: string;
    oldPrice: string | null;
    expirationDate: string;
    quantity: number;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    categories: Category[];
    vendor: Vendor;
    // feedbacks: Feedback[];
  };
}
interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
interface Vendor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string | null;
}

const ProductsCard: React.FC<ProductsCardProps> = ({ data }) => {
  const { id, images, name, categories, newPrice, description, expirationDate, quantity } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const dateObject = new Date(expirationDate);
  const formattedExpirationDate = `${dateObject.getMonth() + 1}-${dateObject.getDate()}-${dateObject.getFullYear()}`;
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleDelete = async () => {
    console.log(`Deleting product with id: ${id}`);
    dispatch(deleteProduct(id));

    toast.success(`Product ${name} was deleted sucefully`);
    setIsModalOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  return (
    <>
      <Link
        to={`/vendor/dashboard/products/${id}`}
        className="max-w-80 xmd:w-full px-3 py-4 lg:p-4 rounded-md shadow-lg bg-[#e2e6ea] hover:bg-[#c9ced3] flex flex-col gap-5"
      >
        <div className="flex items-start gap-2 lg:gap-5">
          <img
            src={images[0]}
            alt="product-image"
            className="w-[78px] h-[78px] lg:w-[84px] lg:h-[84px] object-cover rounded-lg"
          />
          <div className="flex lg:gap-4 justify-between h-full w-full pt-1">
            <div className="flex flex-col justify-between">
              <div>
                <p className="font-semibold lg:text-lg capitalize leading-3">{name}</p>
                <p className="font-medium text-[.75rem] xmd:text-[.8rem] lg:text-[.85rem] text-black/60 capitalize">
                  {categories[0] ? categories[0].name : 'knights store'}
                </p>
              </div>
              <p className="font-semibold leading-3 text-[#232321] text-[.85rem] xmd:text-[.9rem] lg:text-[.95rem]">
                {newPrice} RWF
              </p>
            </div>
            <button
              className="p-1 rounded border bg-red-100/50 hover:bg-red-100 h-max"
              onClick={handleDeleteClick}
              data-testid="delete-button"
            >
              <Trash2 className="text-red-500 w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-[.85rem] xmd:text-[.9rem] lg:text-[.95rem]">Description</p>
            <p className="text-neutral-700 text-justify leading-4 text-[.75rem] xmd:text-[.8rem] lg:text-[.85rem] h-9">
              {description.length > 100 ? `${description.slice(0, 90) + '...'}` : description}
            </p>
          </div>
          <div className="font-medium text-[.8rem] xmd:text-[.85rem] lg:text-[.9rem]">
            <div className="py-[5px] border-t-[1px] border-neutral-400 w-full flex justify-between">
              <p>Remaining Quantity</p>
              <p className="text-neutral-700">{quantity}</p>
            </div>
            <div className="py-[5px] border-t-[1px] border-neutral-400 w-full flex justify-between">
              <p>Expiration Date</p>
              <p className="text-neutral-700">{expirationDate ? formattedExpirationDate : '---'}</p>
            </div>
          </div>
        </div>
      </Link>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-8 rounded-lg flex flex-col gap-4 items-center">
            <p className="mb-4">
              Are you sure you want to delete the product <span className="font-bold">&quot;{name}&quot;</span>?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
                data-testid="delete-confirmation"
              >
                Delete
              </button>
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ProductsCard;
