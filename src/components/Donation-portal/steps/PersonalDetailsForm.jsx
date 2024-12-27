import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import PAFModal from "./PAF";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../../Dashboard/PaymentGateway";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import PaymentPage from "../../../pages/test";


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
    paywith: ""
  });
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  
  const [addCity, setAddCity] = useState(false);
  const [NewCity, setNewCity] = useState("");
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_ICHARMS_URL;
  const apiToken = import.meta.env.VITE_ICHARMS_API_KEY;

  // PayPal handlers
  const handlePayPalOrder = async () => {
    try {
      const response = await axios.post("http://localhost:3001/create-paypal-order", {
        amount: 1000, // Replace with actual amount from your form
      });
      return response.data.id;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadPayPalScript = () => {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=Adm3RyFPf-3U4qNUuTD8d1G2grwiwfCfDkh04R2AKjC_yjYbbvWtiBSKnR-P2tAAGS510XkopYKa-E3p&currency=GBP&components=buttons`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
      return script;
    };

    const paypalScript = loadPayPalScript();
    return () => {
      if (paypalScript) {
        document.body.removeChild(paypalScript);
      }
    };
  }, []);



  const handlePayPalCapture = async (data, actions) => {
    try {
      const response = await axios.post("http://localhost:3001/capture-paypal-order", {
        orderId: data.orderID,
      });
      if (response.data.status === "COMPLETED") {
        setIsSuccess(true);
        setCurrentStep(5);
      }
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      setIsSuccess(false);
    }
  };

  // Stripe handler
  const buyFunction = async () => {
    try {
      const response = await axios.post("http://localhost:3000/payment", {});
      if (response.status === 200) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error processing Stripe payment:", error);
    }
  };

  const handleChange = (e) => {      
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePaymentSelection = (event) => {
    const selectedPayment = event.target.id;
    setFormData(prev => ({
      ...prev,
      paywith: selectedPayment,
    }));
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

  const updateTransaction = async (refId) => {
    const sessionId = generateSessionId();
    const giftaid = localStorage.getItem("giftaidclaim");
    const { value } = JSON.parse(giftaid);
    const contactPreferences = localStorage.getItem("contactPreferences");
    const {email, phone, post, sms} = JSON.parse(contactPreferences);
    const Form_Data = new FormData();

    Form_Data.append("auth", 0);
    Form_Data.append("session_id", sessionId);
    Form_Data.append("reference_no", refId);
    Form_Data.append("guest_details", JSON.stringify(formData));
    Form_Data.append("payment_method", formData.paywith);
    Form_Data.append("claim_donation", value);
    Form_Data.append("tele_calling", phone);
    Form_Data.append("send_email", email);
    Form_Data.append("send_mail", post);
    Form_Data.append("send_text", sms);

    try {
      const response = await axios.post(
        `${apiUrl}payment/transaction`,
        Form_Data,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      address1: document.getElementById("address-1").value,
      address2: document.getElementById("address-2").value,
      postcode: document.getElementById("postCode").value,
      city: document.getElementById("city")?.value || NewCity,
      city_id: 22,
      city_name: "london",
      country: String(document.getElementById("countries").value),
    };

    setFormData(updatedFormData);

    try {
      const refId = await updateReferenceId();
      await updateTransaction(refId);
      
      switch(formData.paywith) {
        case 'paypal':
          // PayPal flow will be handled by PayPal buttons
          return;
        case 'stripe':
          setIsPaymentGatewayOpen(true);
          break;
        case 'worldpay':
          // Add WorldPay specific logic here
          break;
        default:
          console.error("Invalid payment method selected");
      }
    } catch (err) {
      console.error("Error during form submission:", err);
    }
  };




  return (
   
      <Elements stripe={stripePromise}>
        <PaymentForm 
          setCurrentStep={setCurrentStep} 
          isPaymentGatewayOpen={isPaymentGatewayOpen} 
          setIsPaymentGatewayOpen={setIsPaymentGatewayOpen}
        />
        <form onSubmit={handleSubmit} className="flex justify-center items-center">
          <div className="rounded-lg md:p-8 px-2 w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#02343F]">
              Enter Your Personal Details
            </h2>
            
            {/* Personal Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="w-full">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
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
                <label htmlFor="first_name" className="block text-gray-700 font-bold mb-2">
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
                <label htmlFor="last_name" className="block text-gray-700 font-bold mb-2">
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
                <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
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
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
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
            
            {/* Address Section */}
            <PAFModal
              NewCity={NewCity}
              setNewCity={setNewCity}
              addCity={addCity}
              setAddCity={setAddCity}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />

            <hr className="border-t border-black md:mx-[-40px] my-4" />
            
            {/* Payment Method Section */}
            <h2 className="text-2xl font-bold mb-6 text-center text-[#02343F]">
              Select Payment Method
            </h2>
            <div className="container mx-auto md:p-6">
              <div className="grid grid-cols-3 gap-6">
                {["stripe", "worldpay", "paypal"].map((paymentMethod) => (
                  <div key={paymentMethod} className="flex items-center flex-col bg-gray-50 border">
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

            {/* Payment Buttons Section */}
            {formData.paywith === 'paypal' ? 
               <><PaymentPage/></>
             : (
              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#02343F] text-white hover:bg-[#02343fc5]"
                >
                  Proceed To Payment
                </button>
              </div>
            )}
          </div>
        </form>
      </Elements>
  );
};

export default PersonalDetailsForm;