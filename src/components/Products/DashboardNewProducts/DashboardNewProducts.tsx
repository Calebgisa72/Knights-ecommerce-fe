import React, { useState, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import toast from 'react-hot-toast';
import axios from 'axios';
import { createProduct, resetProductState } from '../../../redux/actions/productAction';
import { Link } from 'react-router-dom';
import { CircleCheck } from 'lucide-react';

const DashboardNewProducts: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category2, setCategory2] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [onFocus, setOnFocus] = useState(false);
  const [filterdCategories, setFilteredCategories] = useState<{ id: string; name: string }[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { error, loading, product: ProductsResponse } = useSelector((state: RootState) => state.productCreate);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (ProductsResponse) {
      toast.success('Product created');
      resetForm();
      dispatch(resetProductState());
    }
  }, [error, ProductsResponse, dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/product/categories`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error fetching categories');
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prevImages) => [...prevImages, ...files]);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previewUrls]);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    setFilteredCategories(
      categories.filter((category) => {
        return category.name.toLowerCase().includes(category2.toLowerCase());
      })
    );
  }, [categories, category2]);

  const handleCreateCategory = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategory2(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
  };

  const defaultCategories = ['Women', 'Men', 'Kids', 'Electronics', 'Fashion', 'Accessories', 'Jewelries'];

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (productName.trim().length < 3) {
      errors.productName = 'Product name must be at least 3 characters long.';
    }
    if (description.trim().length < 3) {
      errors.description = 'Description must be at least 3 characters long.';
    }
    if (!selectedOption && category2.trim().length < 1) {
      errors.category = 'Please select or enter a category.';
    }
    if (!quantity || isNaN(Number(quantity))) {
      errors.quantity = 'Please enter a valid quantity.';
    }
    if (!newPrice || isNaN(Number(newPrice))) {
      errors.newPrice = 'Please enter a valid price.';
    }
    if (images.length < 2) {
      errors.images = 'Please upload at least two images.';
    }
    if (images.length > 6) {
      errors.images = 'You can upload up to six images only.';
    }
    if (!expirationDate) {
      errors.expirationDate = 'You need an expiry date';
    } else {
      const selectedDate = new Date(expirationDate);
      const currentDate = new Date();
      if (selectedDate < currentDate) {
        errors.expirationDate = 'Expiration date cannot be in the past';
      }
    }
    return errors;
  };

  const resetForm = () => {
    setProductName('');
    setDescription('');
    setCategory2('');
    setQuantity('');
    setNewPrice('');
    setSelectedOption('');
    setImages([]);
    setImagePreviews([]);
    setErrors({});
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', description);
    formData.append('quantity', quantity);
    formData.append('newPrice', newPrice);
    formData.append('categories', selectedOption.toLowerCase() || category2.toLowerCase());
    formData.append('expirationDate', expirationDate || '2025-0-0');

    images.forEach((image) => {
      formData.append('images', image);
    });

    dispatch(createProduct(formData) as any);
  };

  return (
    <div className="flex bg-[#eef5ff] w-full h-full text-black p-8 flex-col items-start">
      <p className="font-bold text-2xl">Add New Product</p>
      <p>
        <Link to={'/vendor/dashboard'}>Dashboard</Link> &gt; <Link to={'/vendor/dashboard/products'}>Products</Link>{' '}
        &gt; #New
      </p>
      <div className="bg-white border-[1px] border-[#7c7c7c] rounded-2xl mt-8 w-full p-8">
        <div className="w-full flex gap-8">
          <div className="w-1/2 flex flex-col gap-4">
            <p className="font-bold text-2xl">General Information</p>
            <div className="flex flex-col items-start gap-1">
              <p className="font-medium">Product Name</p>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="bg-white border-[1px] rounded px-4 py-2 w-full"
              />
              {errors.productName && <p className="text-red-500">{errors.productName}</p>}
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="font-medium">Description</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white border-[1px] rounded px-4 py-2 w-full"
              />
              {errors.description && <p className="text-red-500">{errors.description}</p>}
            </div>
            <div className="flex flex-col items-start gap-1 w-full">
              <p className="font-medium">Category</p>
              <div className="flex justify-between gap-4 w-full">
                <select
                  value={selectedOption}
                  onChange={handleSelectChange}
                  className="bg-white border-[1px] rounded px-1 py-2 w-[40%] cursor-pointer"
                  disabled={categories?.length === 0 || !categories}
                >
                  <option value="">
                    {categories?.length === 0 || !categories ? 'No categories available' : 'Select an option'}
                  </option>
                  {defaultCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="w-[60%] relative flex flex-col gap-2">
                  <input
                    data-testid="categoryInput"
                    value={category2}
                    onFocus={() => setOnFocus(true)}
                    onBlur={() => setOnFocus(false)}
                    onChange={(e) => handleCreateCategory(e)}
                    placeholder="create your own category"
                    className="bg-white border-[1px] rounded px-4 py-2 w-full"
                  />
                  {onFocus && filterdCategories.length > 0 && (
                    <div className=" absolute top-10 z-[450] max-h-72 overflow-y-scroll w-full bg-neutral-100">
                      <div className="py-2 px-4 flex flex-col gap-2 w-full">
                        {filterdCategories.map((category, index) => {
                          return (
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setCategory2(
                                  category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()
                                );
                              }}
                              className="cursor-pointer hover:bg-neutral-200 flex justify-between items-center border-b-[1px] border-[#D1D1D1]"
                              key={index}
                            >
                              <div>{category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}</div>
                              {category2.toLowerCase() === category.name.toLowerCase() && (
                                <i className="fa-solid text-green-500 fa-circle-check"></i>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {errors.category && <p className="text-red-500">{errors.category}</p>}
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="font-medium">Quantity</p>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-white border-[1px] rounded px-4 py-2 w-full"
              />
              {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="font-medium">Expiration Date</p>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="bg-white border-[1px] rounded px-4 py-2 w-full"
              />
              {errors.expirationDate && <p className="text-red-500">{errors.expirationDate}</p>}
            </div>
            <div className="flex flex-col items-start gap-1 mt-8">
              <p className="font-bold text-2xl">Pricing</p>
              <div className="flex flex-col items-start gap-1">
                <p className="font-medium">New Price (Rwf)</p>
                <input
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="bg-white border-[1px] rounded px-4 py-2 w-full"
                />
                {errors.newPrice && <p className="text-red-500">{errors.newPrice}</p>}
              </div>
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-8">
            <p className="font-bold text-2xl">Product Media</p>
            <div className="flex flex-col items-start gap-1">
              <p className="font-medium">Image Upload</p>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="bg-white border-[1px] rounded px-4 py-2 w-full"
              />
              {errors.images && <p className="text-red-500">{errors.images}</p>}
            </div>
            <div className="flex flex-col">
              {imagePreviews.map((preview, index) => (
                <div className="p-4 rounded-lg bg-[#FAFAFA] flex gap-4" key={index}>
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <p className="text-ellipsis overflow-hidden">{preview}</p>
                  <CircleCheck className="w-12 h-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-8 mt-8">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-8 py-4 rounded-lg text-white bg-[#070f2b] hover:scale-105 transition-all"
          >
            {loading ? 'Loading...' : 'New Product'}
          </button>
          <Link
            to={'/vendor/dashboard/products'}
            className="px-8 py-4 rounded-lg text-white bg-[#7c7c7c] hover:scale-105 transition-all"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewProducts;
