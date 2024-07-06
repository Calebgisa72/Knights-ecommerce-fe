import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchProducts,
  createProduct,
  fetchVendorProducts,
  fetchSingleProduct,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  createCoupon,
  deleteProduct,
  updateProduct
} from '../../redux/actions/productAction';
import { ProductActionTypes } from '../../redux/types/productTypes'; // Adjust the path accordingly
import { describe, it, beforeEach } from 'vitest';
import { createTestStore } from '../storeWithCapturedActions';

const mockAxios = new MockAdapter(axios);

describe('Product Actions', () => {
  let store: ReturnType<typeof createTestStore>['store'];
  let actions: ReturnType<typeof createTestStore>['actions'];

  beforeEach(() => {
    const testStore = createTestStore();
    store = testStore.store;
    actions = testStore.actions;
    mockAxios.reset();
  });

  it('creates FETCH_PRODUCTS when fetching products has been done', async () => {
    const mockData = { data: 'mocked data' };
    mockAxios.onGet(`${import.meta.env.VITE_APP_API_URL}/product/all`).reply(200, mockData);

    await store.dispatch(fetchProducts() as any);

    expect(actions[0].type).toEqual('products/fetchProducts/pending');
    expect(actions[1].type).toEqual('products/fetchProducts/fulfilled');
    expect(actions[1].payload).toEqual(mockData);
  });

  it('creates CREATE_PRODUCT_SUCCESS when creating a product has been done', async () => {
    const mockData = { data: 'mocked data', status: 201 };
    const formData = new FormData();
    const token = 'mockedToken';
    localStorage.setItem('userToken', JSON.stringify({ token }));

    mockAxios.onPost(`${import.meta.env.VITE_APP_API_URL}/product/`).reply(201, mockData);

    await store.dispatch(createProduct(formData) as any);

    expect(actions[0]).toEqual({ type: ProductActionTypes.CREATE_PRODUCT_REQUEST });
    expect(actions[1].type).toEqual(ProductActionTypes.CREATE_PRODUCT_SUCCESS);
  }, 50000);

  it('creates FETCH_VENDOR_PRODUCTS when fetching vendor products has been done', async () => {
    const mockData = { data: 'mocked data' };
    const token = 'mockedToken';
    localStorage.setItem('userToken', JSON.stringify({ token }));

    mockAxios.onGet(`${import.meta.env.VITE_APP_API_URL}/product/collection`).reply(200, mockData);

    await store.dispatch(fetchVendorProducts() as any);

    expect(actions[0].type).toEqual('vendorProducts/fetchVendorProducts/pending');
    expect(actions[1].type).toEqual('vendorProducts/fetchVendorProducts/rejected');
    expect(actions[1].payload).toEqual('Request failed with status code 404');
  }, 50000);

  it('creates FETCH_SINGLE_PRODUCT when fetching a single product has been done', async () => {
    const mockData = { product: 'mocked product' };
    const productId = 'mockedId';

    mockAxios.onGet(`${import.meta.env.VITE_APP_API_URL}/product/${productId}`).reply(200, mockData);

    await store.dispatch(fetchSingleProduct(productId) as any);

    expect(actions[0].type).toEqual('products/fetchSingleProduct/pending');
    expect(actions[1].type).toEqual('products/fetchSingleProduct/fulfilled');
    expect(actions[1].payload).toEqual(mockData.product);
  }, 50000);
  // Test for createCoupon negative scenario
  it('handles error when creating a coupon fails', async () => {
    const errorResponse = { message: 'Failed to create coupon' };
    const couponArgs = {
      data: {
        code: 'maxime',
        discountRate: 15,
        expirationDate: '2025-12-31',
        maxUsageLimit: 100,
        discountType: 'percentage',
        product: '056fc8d6-7d45-4ef8-b604-4efd7fb243ae'
      },
      vendorid: 'invalidVendorId' // Using an invalid vendor ID intentionally
    };

    mockAxios
      .onPost(`${import.meta.env.VITE_APP_API_URL}/coupons/vendor/${couponArgs.vendorid}`, couponArgs.data)
      .reply(404, errorResponse);

    try {
      await store.dispatch(createCoupon(couponArgs) as any);
    } catch (error) {
      expect(actions[0].type).toEqual('products/createCoupon/pending');
      expect(actions[1].type).toEqual('products/createCoupon/rejected');
      expect(actions[1].error.message).toEqual('Failed to create coupon');
    }
  }, 50000);

  // Test for getCoupon negative scenario
  it('handles error when fetching coupons fails', async () => {
    const errorResponse = { message: 'Failed to fetch coupons' };
    const vendorId = 'invalidVendorId'; // Using an invalid vendor ID intentionally

    mockAxios
      .onGet(`${import.meta.env.VITE_APP_API_URL}/coupons/vendor/${vendorId}/access-coupons`)
      .reply(404, errorResponse);

    try {
      await store.dispatch(getCoupon({ vendorId }) as any);
    } catch (error) {
      expect(actions[0].type).toEqual('products/getCoupon/pending');
      expect(actions[1].type).toEqual('products/getCoupon/rejected');
      expect(actions[1].error.message).toEqual('Failed to fetch coupons');
    }
  }, 50000);

  // Test for deleteCoupon negative scenario
  it('handles error when deleting a coupon fails', async () => {
    const errorResponse = { message: 'Failed to delete coupon' };
    const vendorId = 'invalidVendorId'; // Using an invalid vendor ID intentionally

    mockAxios
      .onDelete(`${import.meta.env.VITE_APP_API_URL}/coupons/vendor/${vendorId}/checkout/delete`)
      .reply(404, errorResponse);

    try {
      await store.dispatch(deleteCoupon({ vendorId }) as any);
    } catch (error) {
      expect(actions[0].type).toEqual('products/deleteCoupon/pending');
      expect(actions[1].type).toEqual('products/deleteCoupon/rejected');
      expect(actions[1].error.message).toEqual('Failed to delete coupon');
    }
  }, 50000);

  // Test for updateCoupon negative scenario
  it('handles error when updating a coupon fails', async () => {
    const errorResponse = { message: 'Failed to update coupon' };
    const updateArgs = {
      vendorId: 'invalidVendorId', // Using an invalid vendor ID intentionally
      code: 'maxime',
      data: {
        code: 'maxime',
        discountRate: 15,
        expirationDate: '2025-12-31',
        maxUsageLimit: 100,
        discountType: 'percentage',
        product: '056fc8d6-7d45-4ef8-b604-4efd7fb243ae'
      }
    };

    mockAxios
      .onPut(
        `${import.meta.env.VITE_APP_API_URL}/coupons/vendor/${updateArgs.vendorId}/update-coupon/${updateArgs.code}`,
        updateArgs.data
      )
      .reply(404, errorResponse);

    try {
      await store.dispatch(updateCoupon(updateArgs) as any);
    } catch (error) {
      expect(actions[0].type).toEqual('products/updateCoupon/pending');
      expect(actions[1].type).toEqual('products/updateCoupon/rejected');
      expect(actions[1].error.message).toEqual('Failed to update coupon');
    }
  }, 50000);

  it('creates DELETE_PRODUCT_SUCCESS when deleting a product has been done', async () => {
    const productId = 'mockedProductId';
    const token = 'mockedToken';
    localStorage.setItem('userToken', JSON.stringify({ token }));

    mockAxios.onDelete(`${import.meta.env.VITE_APP_API_URL}/product/${productId}`).reply(200);

    await store.dispatch(deleteProduct(productId) as any);

    expect(actions[0].type).toEqual('products/deleteProduct/pending');
    expect(actions[1].type).toEqual('products/deleteProduct/fulfilled');
    expect(actions[1].payload).toEqual(productId);
  });

  it('creates DELETE_PRODUCT_FAIL when deleting a product fails', async () => {
    const productId = 'mockedProductId';
    const token = 'mockedToken';
    localStorage.setItem('userToken', JSON.stringify({ token }));

    mockAxios.onDelete(`${import.meta.env.VITE_APP_API_URL}/product/${productId}`).reply(404);

    await store.dispatch(deleteProduct(productId) as any);

    expect(actions[0].type).toEqual('products/deleteProduct/pending');
    expect(actions[1].type).toEqual('products/deleteProduct/rejected');
    expect(actions[1].error?.message).toEqual('Rejected');
  });

  it('handles unauthorized deletion with expired token', async () => {
    const productId = 'mockedProductId';
    const expiredToken = 'expiredToken';
    localStorage.setItem('userToken', JSON.stringify({ token: expiredToken }));

    mockAxios.onDelete(`${import.meta.env.VITE_APP_API_URL}/product/${productId}`).reply(401);

    try {
      await store.dispatch(deleteProduct(productId) as any);
    } catch (error) {
      expect(actions[0].type).toEqual('products/deleteProduct/pending');
      expect(actions[1].type).toEqual('products/deleteProduct/rejected');
      expect(actions[1].error?.message).toEqual('Unauthorized');
    }

    // Clear localStorage after unauthorized access
    localStorage.removeItem('userToken');

    // Ensure localStorage is cleared
    expect(localStorage.getItem('userToken')).toBeNull();
  });

  it('handles network errors when deleting a product', async () => {
    const productId = 'mockedProductId';
    const token = 'mockedToken';
    localStorage.setItem('userToken', JSON.stringify({ token }));

    mockAxios.onDelete(`${import.meta.env.VITE_APP_API_URL}/product/${productId}`).networkError();

    try {
      await store.dispatch(deleteProduct(productId) as any);
    } catch (error) {
      expect(actions[0].type).toEqual('products/deleteProduct/pending');
      expect(actions[1].type).toEqual('products/deleteProduct/rejected');
      expect(actions[1].error?.message).toEqual('Network Error');
    }
  });

  it('creates UPDATE_PRODUCT_SUCCESS when updating a product has been done', async () => {
    const productId = 'mockedProductId';
    const formData = new FormData();
    const token = 'mockedToken';
    localStorage.setItem('userToken', JSON.stringify({ token }));

    mockAxios.onPut(`${import.meta.env.VITE_APP_API_URL}/product/${productId}`).reply(200);

    await store.dispatch(updateProduct({ id: productId, formData }) as any);

    expect(actions[0].type).toEqual('products/updateProduct/pending');
    expect(actions[1].type).toEqual('products/updateProduct/fulfilled');
    expect(actions[1].payload).toEqual(undefined); // Adjust this based on your actual payload expectation
  });

  it('creates UPDATE_PRODUCT_FAIL when updating a product fails', async () => {
    const productId = 'mockedProductId';
    const formData = new FormData();
    const token = 'mockedToken';
    localStorage.setItem('userToken', JSON.stringify({ token }));

    mockAxios.onPut(`${import.meta.env.VITE_APP_API_URL}/product/${productId}`).reply(404);

    try {
      await store.dispatch(updateProduct({ id: productId, formData }) as any);
    } catch (error: any) {
      expect(actions[0].type).toEqual('products/updateProduct/pending');
      expect(actions[1].type).toEqual('products/updateProduct/rejected');
      expect(error.message).toEqual('Request failed with status code 404'); // Adjust this based on the actual error message structure
    }
  });

  it('handles network errors when updating a product', async () => {
    const productId = 'mockedProductId';
    const formData = new FormData();
    const token = 'mockedToken';
    localStorage.setItem('userToken', JSON.stringify({ token }));

    mockAxios.onPut(`${import.meta.env.VITE_APP_API_URL}/product/${productId}`).networkError();

    try {
      await store.dispatch(updateProduct({ id: productId, formData }) as any);
    } catch (error) {
      expect(actions[0].type).toEqual('products/updateProduct/pending');
      expect(actions[1].type).toEqual('products/updateProduct/rejected');
      expect(actions[1].error?.message).toEqual('Network Error');
    }
  });
});
