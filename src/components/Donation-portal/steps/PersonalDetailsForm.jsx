import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import PAFModal from "./PAF";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import Modal from 'react-modal';

const PaymentModal = ({ isOpen, onRequestClose, onPaymentSuccess, setCurrentStep, setIsSuccess }) => {
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
      type: "card",
      card: cardElement,
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    // Call your server to create the payment intent and confirm the payment
    const response = await fetch(
      "https://node-donation-portal.onrender.com/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000 }), // Example amount
      }
    );

    const { clientSecret } = await response.json();
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: paymentMethod.id,
      }
    );

    if (confirmError) {
      setError(confirmError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      onPaymentSuccess(paymentIntent);
      setLoading(false);
      setIsSuccess(true);
      setCurrentStep(5);
      onRequestClose();
    } else {
      setCurrentStep(5);
      setIsSuccess(false);
      onRequestClose();
    }
  };

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      padding: '0',
      border: 'none',
      borderRadius: '8px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      contentLabel="Payment Modal"
    >
      <div className="payment-modal">
        <style>
          {`
            .payment-modal {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .header {
              background-color: #1a1a1a;
              color: white;
              padding: 20px;
            }

            .header-amount {
              font-size: 32px;
              font-weight: bold;
              margin: 10px 0;
            }

            .header-country {
              color: #888;
              font-size: 14px;
            }

            .payment-form {
              padding: 20px;
            }

            .form-group {
              margin-bottom: 20px;
            }

            .form-label {
              display: block;
              margin-bottom: 8px;
              color: #333;
              font-size: 14px;
            }

            .form-input {
              width: 100%;
              padding: 12px;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 16px;
            }

            .card-element {
              border: 1px solid #ddd;
              padding: 12px;
              border-radius: 4px;
              background: white;
            }

            .error-message {
              color: #dc2626;
              font-size: 14px;
              margin-top: 8px;
            }

            .pay-button {
              width: 100%;
              padding: 14px;
              background: #000;
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 16px;
              cursor: pointer;
              margin-top: 20px;
            }

            .pay-button:disabled {
              background: #666;
              cursor: not-allowed;
            }

            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
              border-top: 1px solid #eee;
            }

            @media (max-width: 600px) {
              .header-amount {
                font-size: 28px;
              }
              
              .payment-form {
                padding: 15px;
              }
            }
          `}
        </style>

        <div className="header">
          <div>Food Packs</div>
          <div className="header-amount">£100.00</div>
          <div className="header-country">For Country: Pakistan</div>
        </div>

        <div className="payment-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Card Details</label>
              <CardElement
                className="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <button
              type="submit"
              disabled={loading || !stripe}
              className="pay-button"
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          </form>
        </div>

        <div className="footer">
          <span>Powered by stripe</span>
        </div>
      </div>
    </Modal>
  );
};

const PersonalDetailsForm = ({ currentStep, setCurrentStep, setIsSuccess }) => {
  const stripePromise = loadStripe(
    "pk_test_51QZ5TIP6D9LHv1Cj1DhRgOUqhSNlcoh8JOOYU77zkfmtX2g6LFKzNYkAu7j8H9qYCeHnIBgnpqfTWbb5p2WXdTsB00Yl6A05vL"
  );
  const [formData, setFormData] = useState({
    title: "Mr",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    postcode: "",
    city: "",
    city_id: "",
    country: "",
  });
  const [addCity, setAddCity] = useState(false);
  const [NewCity, setNewCity] = useState("");
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
  

  const apiUrl = import.meta.env.VITE_ICHARMS_URL;
  const apiToken = import.meta.env.VITE_ICHARMS_API_KEY;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePaymentSelection = (event) => {
    console.log("Payment method selected:", event.target.id);
  };

  const generateSessionId = () => {
    const existingSessionData = localStorage.getItem("sessionIdData");
    if (existingSessionData) {
      const { sessionId, expiry } = JSON.parse(existingSessionData);
      if (new Date().getTime() < expiry) {
        return sessionId;
      }
    }

    const timestamp = new Date().getTime();
    const randomPart = Math.random().toString(36).substring(2, 15);
    const newSessionId = `session-${timestamp}-${randomPart}`;
    const expiryTime = timestamp + 24 * 60 * 60 * 1000;

    localStorage.setItem(
      "sessionIdData",
      JSON.stringify({ sessionId: newSessionId, expiry: expiryTime })
    );

    return newSessionId;
  };

  // React Query Mutation to update reference ID
  const updateReferenceId = async () => {
    const referenceId = Array(32)
      .fill(0)
      .map(() => "12345abcde"[Math.floor(Math.random() * 10)])
      .join("");

    try {
      const response = await axios.get(
        `${apiUrl}payment/reference/${referenceId}`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.reference_id;
    } catch (err) {
      console.error("Error in updating reference ID:", err.message);
      throw err;
    }
  };

  // React Query Mutation to update transaction
  const updateTransaction = async (refId) => {
    const sessionId = generateSessionId();

    // Create a new FormData object
    const Form_Data = new FormData();

    // Append the form fields to FormData
    Form_Data.append("auth", 0);
    Form_Data.append("session_id", sessionId);
    Form_Data.append("reference_no", refId);
    Form_Data.append("guest_details", JSON.stringify(formData));

    try {
      const response = await axios.post(
        `${apiUrl}payment/transaction`,
        Form_Data,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            // Set Content-Type to multipart/form-data when using FormData
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Transaction created successfully:", response.data);
      if (response.data.success) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
    } catch (err) {
      console.error("Error in creating transaction:", err.message);
      throw err;
    }
  };

  const buyFunction = async () => {
    try {
      const response = await axios.post("http://localhost:3000/payment", {});
      console.log(response, "response");

      if (response.status === 200) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      address1: document.getElementById("address-1").value,
      address2: document.getElementById("address-2").value,
      postcode: document.getElementById("postCode").value,
      city: document.getElementById("city")?.value || NewCity,
      city_id: "22",
      country: String(document.getElementById("countries").value),
    };

    setFormData(updatedFormData);

    try {
      const refId = await updateReferenceId();

      console.log(refId, "refId");

      await updateTransaction(refId);
      // await buyFunction();
      openPaymentModal()
      // setCurrentStep(5)
    } catch (err) {
      console.error("Error during form submission:", err);
    }
  };

  return (
    <>
      <Elements stripe={stripePromise}>
        {/* <button onClick={updateReferenceId}>Click Me</button> */}
        <PaymentModal
        setCurrentStep={setCurrentStep}
        isOpen={modalIsOpen}
        onRequestClose={closePaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
        setIsSuccess={setIsSuccess}
      />
        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center"
        >
          <div className="rounded-lg md:p-8 px-2 w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#02343F]">
              Enter Your Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="w-full">
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Title
                </label>
                <select
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                </select>
              </div>
              <div className="w-full">
                <label
                  htmlFor="first_name"
                  className="block text-gray-700 font-bold mb-2"
                >
                  <span className="text-red-600">*</span> First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="last_name"
                  className="block text-gray-700 font-bold mb-2"
                >
                  <span className="text-red-600">*</span> Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="w-full">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-bold mb-2"
                >
                  <span className="text-red-600">*</span> Phone
                </label>
                <input
                  type="number"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone no"
                  className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
                  <span className="text-red-600">*</span> Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="border-gray-300 rounded py-3 px-2 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                  required
                />
              </div>
            </div>
            <hr className="border-t border-black md:mx-[-40px] my-4" />
            <PAFModal
              NewCity={NewCity}
              setNewCity={setNewCity}
              addCity={addCity}
              setAddCity={setAddCity}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
            <hr className="border-t border-black md:mx-[-40px] my-4" />
            <h2 className="text-2xl font-bold mb-6 text-center text-[#02343F]">
              Select Payment Method
            </h2>
            <div className="container mx-auto md:p-6">
              <div className="grid grid-cols-3 gap-6">
                {["stripe", "worldpay", "paypal"].map((paymentMethod) => (
                  <div
                    key={paymentMethod}
                    className={`flex items-center flex-col bg-gray-50 border `}
                  >
                    <input
                      type="radio"
                      id={paymentMethod}
                      name="paymentMethod"
                      className="relative md:right-[-80px] top-2"
                      onChange={handlePaymentSelection}
                      required
                    />
                    <label
                      htmlFor={paymentMethod}
                      className="flex flex-col items-center space-y-2 cursor-pointer"
                    >
                      <img
                        src={`/${paymentMethod}.svg`}
                        alt={`${paymentMethod} logo`}
                        className="w-[100px] h-[100px]"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#02343F] text-white hover:bg-[#02343fc5] "
              >
                Proceed To Payment
              </button>
            </div>
          </div>
        </form>
      </Elements>
    </>
  );
};

export default PersonalDetailsForm;
