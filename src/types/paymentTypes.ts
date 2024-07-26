// types.ts
export interface PaymentIntent {
  id: string;
  amount: number;
  amount_received: number;
  status: string;
  [key: string]: any; // Add additional fields as needed
}

export interface Statistics {
  totalPayments: number;
  totalAmount: number;
  totalCapturedAmount: number;
  successfulPayments: number;
  pendingPayments: number;
  averagePaymentAmount: number;
}

export interface ApiResponse {
  payments: PaymentIntent[];
  statistics: Statistics;
}
