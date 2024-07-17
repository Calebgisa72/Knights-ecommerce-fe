import React from 'react';
import { Link } from 'react-router-dom';

const PaymentOk = () => {
  return (
    <div className="py-16 flex items-center justify-center flex-col gap-8" data-testid="payment-ok-container">
      <h1 className="text-2xl font-medium" data-testid="payment-ok-message">
        Payment Successful, thank you for shopping with us.
      </h1>
      <Link to={'/'} className="p-4 border font-medium" data-testid="continue-shopping-link">
        Continue Shopping
      </Link>
    </div>
  );
};

export default PaymentOk;
