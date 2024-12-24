import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Modal from 'react-modal';

// Stripe public key (use your own key in production)
const stripePromise = loadStripe('pk_test_51QZ5TIP6D9LHv1Cj1DhRgOUqhSNlcoh8JOOYU77zkfmtX2g6LFKzNYkAu7j8H9qYCeHnIBgnpqfTWbb5p2WXdTsB00Yl6A05vL');

Modal.setAppElement('#root');

const PaymentModal = ({ isOpen, onRequestClose, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    // Call your server to create the payment intent and confirm the payment
    const response = await fetch('http://localhost:3001/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 }), // Example amount
    });

    const { clientSecret } = await response.json();

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      setError(confirmError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      onPaymentSuccess(paymentIntent);
      setLoading(false);
      onRequestClose();  // Close modal after success
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Payment Modal">
      <div className="p-6 w-96 max-w-md mx-auto bg-white shadow-lg rounded-lg"> 
        <h2 className="text-xl font-semibold text-center mb-4">Complete Your Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">Card Details</label>
            <CardElement className="border border-gray-300 p-2 rounded-md" />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading || !stripe}
            className="w-full bg-blue-500 text-white py-2 rounded-md disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </Modal>
  );
};

const PaymentPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');

  const handlePaymentSuccess = (paymentIntent) => {
    setPaymentStatus('Payment Successful!');
    console.log('Payment Intent:', paymentIntent);
  };

  const openPaymentModal = () => {
    setModalIsOpen(true);
  };

  const closePaymentModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-3xl text-center mb-6">Stripe Payment Flow</h1>
        <button
          onClick={openPaymentModal}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Pay Now
        </button>
        {paymentStatus && <p className="mt-4 text-center text-green-500">{paymentStatus}</p>}
      </div>

      <PaymentModal
        isOpen={modalIsOpen}
        onRequestClose={closePaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Elements>
  );
};

export default PaymentPage;
