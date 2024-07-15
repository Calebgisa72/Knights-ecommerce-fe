interface Product {
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
}

export type AddToCartData = {
  productId?: string;
  quantity: number;
};

export interface cartItem {
  id: string;
  newPrice: string;
  quantity: number;
  total: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface cartData {
  totalAmount: number;
  isCheckedOut: boolean;
  id: string;
  createdAt: string;
  updatedAt: string;
  items: cartItem[];
}

export interface CartResponse {
  data: {
    code: number;
    message: string;
    cart: cartData | [] | null;
  };
  status: string;
}
