import store from '../../../redux/store';
import {
  addFeedback,
  createProduct,
  deleteProduct,
  resetProductState,
  updateProduct
} from '../../../redux/actions/productAction';

describe('ProductAction tests', () => {
  it('should fail when no useToken exist', async () => {
    const formData = new FormData();
    formData.append('name', 'New Product');

    await store.dispatch(createProduct(formData));
  });
  it('should fail when no useToken exist on product deletion', async () => {
    await store.dispatch(deleteProduct('sampleText'));
  });
  it('should fail when no useToken exist on product updating', async () => {
    const formData = new FormData();
    formData.append('name', 'New Product');

    await store.dispatch(updateProduct({ id: 'sdfd', formData }));
  });
  it('should reset product state', async () => {
    await store.dispatch(resetProductState());
  });
  it('adding feedback', async () => {
    await store.dispatch(
      addFeedback({
        productId: '3131',
        data: {
          orderId: '323',
          comment: 'comment'
        }
      })
    );
  });
});
