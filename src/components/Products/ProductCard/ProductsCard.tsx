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
  const { id, images, name, categories, newPrice, description, expirationDate } = data;
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
      <Link to={`${id}`} className="w-full p-4 rounded-md shadow-lg bg-[#E7EBEF] flex flex-col gap-8">
        <div className="flex items-center gap-5">
          <img src={images[0]} alt="product-image" className="w-[84px] h-[84px] object-cover rounded-lg" />
          <div className="flex gap-4 justify-between w-full">
            <div className="flex flex-col">
              <p className="font-bold text-lg">{name}</p>
              <p className="text-black/60">{categories[0].name}</p>
              <p className="font-semibold text-[#232321] mt-4">{newPrice}</p>
            </div>
            <button className="p-2 rounded border bg-red-100/50 h-max" onClick={handleDeleteClick}>
              <Trash2 className="text-red-500" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">Description</p>
            <p className="text-[#232321]">{description}</p>
          </div>
          <div>
            <div className="py-2 border-t-[1px] border-[#232321] w-full flex justify-between">
              <p className="font-semibold">Remaining Quantity</p>
              <p className="text-[#232321]">10</p>
            </div>
            <div className="py-2 border-t-[1px] border-[#232321] w-full flex justify-between">
              <p className="font-semibold">Expiration Date</p>
              <p className="text-[#232321]">{formattedExpirationDate}</p>
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
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
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
