export interface Order {
  id: string;
  orderItems: {
    id: string;
    product: {
      id: string;
      name: string;
      description: string;
      images: string[];
      price: string;
      expirationDate: string;
    };
  }[];
}
