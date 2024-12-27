import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
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
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
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
    const selectedPayment = event.target.id;
    console.log("Payment method selected:", selectedPayment);
    setFormData((prev) => ({
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
      "sessionIdDatatr",
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
  const updateTransaction = async (refId ,updatedFormData) => {
    // Generate session ID
    const sessionId = generateSessionId();

    // Initialize default values
    let giftaidValue = "N";
    let contactPrefs = {
      email: "N",
      phone: "N",
      post: "N",
      sms: "N",
    };

    // Get giftaid information from localStorage
    try {
      const giftaidData = localStorage.getItem("giftaidclaim");
      if (giftaidData) {
        const { value } = JSON.parse(giftaidData);
        giftaidValue = value || "N";
      }
    } catch (error) {
      console.error("Error parsing giftaid data:", error);
    }

    // Get contact preferences from localStorage
    try {
      const contactPreferencesData = localStorage.getItem("contactPreferences");
      if (contactPreferencesData) {
        const parsed = JSON.parse(contactPreferencesData);
        contactPrefs = {
          email: parsed.email || "N",
          phone: parsed.phone || "N",
          post: parsed.post || "N",
          sms: parsed.sms || "N",
        };
      }
    } catch (error) {
      console.error("Error parsing contact preferences:", error);
    }

    // Create and populate FormData
    const form_Data = new FormData();
    form_Data.append("auth", 0);
    form_Data.append("session_id", sessionId);
    form_Data.append("reference_no", refId);
    form_Data.append("guest_details", JSON.stringify(updatedFormData));
    form_Data.append("payment_method", formData.paywith);
    form_Data.append("claim_donation", giftaidValue);
    form_Data.append("tele_calling", contactPrefs.phone);
    form_Data.append("send_email", contactPrefs.email);
    form_Data.append("send_mail", contactPrefs.post);
    form_Data.append("send_text", contactPrefs.sms);
    try {
      const response = await axios.post(
        `${apiUrl}payment/transaction`,
        form_Data,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Transaction created successfully:", response.data);
      setIsSuccess(response.data.success);
      return response.data;
    } catch (error) {
      console.error("Error in creating transaction:", error.message);
      setIsSuccess(false);
      throw error;
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
      city_id: "1",
      city_name: document.getElementById("city")?.value || NewCity,
      country: String(document.getElementById("countries").value),
    };

    setFormData(updatedFormData);

    try {
      const refId = await updateReferenceId();

      console.log(refId, "refId");

      await updateTransaction(refId, updatedFormData);
      // await buyFunction();
      // openPaymentModal();
      setIsPaymentGatewayOpen(true);
      // setCurrentStep(5)
    } catch (err) {
      console.error("Error during form submission:", err);
    }
  };

  return (
    <>
      <Elements stripe={stripePromise}>
        {/* <button onClick={updateReferenceId}>Click Me</button> */}
        {/* <PaymentModal
          setCurrentStep={setCurrentStep}
          isOpen={modalIsOpen}
          onRequestClose={closePaymentModal}
          onPaymentSuccess={handlePaymentSuccess}
          setIsSuccess={setIsSuccess}
        /> */}
        <PaymentForm
          setCurrentStep={setCurrentStep}
          isPaymentGatewayOpen={isPaymentGatewayOpen}
          setIsPaymentGatewayOpen={setIsPaymentGatewayOpen}
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
