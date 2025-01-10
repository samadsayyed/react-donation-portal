import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentForm = ({
  onRequestClose,
  onPaymentSuccess,
  setCurrentStep,
  setIsSuccess,
  setIsPaymentGatewayOpen,
  isPaymentGatewayOpen,
  reference_no
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log(cartItems);

  const generateSessionId = () => {
    const existingSessionData = localStorage.getItem("sessionIdData");

    if (existingSessionData) {
      const { sessionId, expiry } = JSON.parse(existingSessionData);

      // Check if the stored session ID is still valid
      if (new Date().getTime() < expiry) {
        return sessionId;
      }
    }

    // Generate a new session ID if none exists or if expired
    const timestamp = new Date().getTime();
    const randomPart = Math.random().toString(36).substring(2, 15);
    const newSessionId = `session-${timestamp}-${randomPart}`;
    const expiryTime = timestamp + 24 * 60 * 60 * 1000; // 1 day in milliseconds

    // Store the new session ID and expiry in localStorage
    localStorage.setItem(
      "sessionIdData",
      JSON.stringify({ sessionId: newSessionId, expiry: expiryTime })
    );

    return newSessionId;
  };

  const apiToken = import.meta.env.VITE_ICHARMS_API_KEY;
  const apiUrl = import.meta.env.VITE_ICHARMS_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    try {
      // Create payment intent
      const createIntentResponse = await axios.post(
        "https://icharms.mysadaqahonline.com/api/v1/payment/stripe/paymentIntent",
        {
          amount: cartItems
            .reduce(
              (total, item) => total + item.donation_amount * item.quantity,
              0
            )
            .toFixed(2) * 100,
          // reference_id: "12344"
          reference_id: reference_no
        }, // £100.00 in pence
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { clientSecret } = createIntentResponse.data;
      console.log(reference_no, "reference_no");

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
          receipt_email: email,
          // reference_no: reference_no
        });




      if (confirmError) {
        setError(confirmError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Record donation
        const donationData = {
          txn_id: paymentIntent.id,
          payment_amt: paymentIntent.amount / 100,
          // currency_code: paymentIntent.currency.toUpperCase(),
          currency: paymentIntent.currency.toUpperCase(),
          payment_status: "Completed",
          payment_mode_code: "STRIPE",
          auth_code: "",
          // donor_id: "donor_12345", // Replace with actual donor ID
          reference_no: reference_no, // Replace with actual reference
          // notes: "Food Packs donation for Pakistan", 
          auth: 0,
          session_id: JSON.parse(localStorage.getItem("sessionIdData"))?.sessionId,
        };

        console.log(donationData, "donationData");


        const donationResponse = await axios.post(
          `${import.meta.env.VITE_ICHARMS_URL}payment/create-single-donation`,
          donationData,
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
              'Content-Type': 'application/json',
            }
          }
        );
        console.log(donationResponse, "donationResponse");
        onPaymentSuccess(paymentIntent);
        setIsSuccess(true);
        setCurrentStep(4);
        // if (donationResponse.data.success) {

        // } else {
        //   setIsSuccess(false);
        // }
      } else {
        setError("Payment failed. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred during the payment process.");
    } finally {
      setLoading(false);
      setCurrentStep(4);
      setIsPaymentGatewayOpen(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const fetchCart = async () => {
    setLoading(true);
    const sessionId = generateSessionId();

    try {
      const response = await fetch(`${apiUrl}cart/cart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      setCartItems(data.cart || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log("PaymentForm mounted");

    fetchCart();
  }, []);

  return (
    <div
      className={`h-[100vh] fixed top-0 left-0 z-50 ${isPaymentGatewayOpen ? "block" : "hidden"
        }   w-full bg-black overflow-hidden`}
    >
      <div className="grid md:grid-cols-2 h-full">
        {/* Left Section */}
        <div className="h-full p-6 md:p-12 lg:p-24 flex flex-col">
          <div className="flex items-center gap-4 mb-12">
            <button
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              onClick={() => setIsPaymentGatewayOpen(false)}
            >
              <ChevronLeft className="text-white" size={20} />
            </button>
            <span className="px-3 py-1 text-sm bg-orange-500 rounded-md text-white">
              TEST MODE
            </span>
          </div>

          <div className="flex-grow flex flex-col justify-center text-white">
            {/* <h2 className="text-lg font-normal mb-2">Food Packs</h2> */}
            <div className="text-4xl md:text-4xl lg:text-6xl font-bold mb-4">
              Total Amount {" "}
              {cartItems
                .reduce(
                  (total, item) => total + item.donation_amount * item.quantity,
                  0
                )
                .toFixed(2)}
            </div>
            <p className="text-gray-400">For Country : United Kingdom</p>
            <p className="text-gray-400">Items:</p>
            {
              cartItems.map((item) => (
                <div key={item.id}>
                  <p>{item.program_name} x {item.quantity} : {item.quantity * item.donation_amount}</p>
                </div>
              ))
            }
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white h-full overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6 md:p-12 lg:p-24">
            <h1 className="text-2xl font-semibold mb-8">Pay with card</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Card information</label>
                <div className="border rounded-md p-3 focus-within:ring-2 focus-within:ring-black">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />
                </div>
                {error && (
                  <div className="mt-2 text-red-600 text-sm">{error}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !stripe}
                className="w-full bg-black text-white py-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Pay"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2 mb-2">
                Powered by
                <span className="font-medium">stripe</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button className="hover:text-gray-700 transition-colors">
                  Terms
                </button>
                <button className="hover:text-gray-700 transition-colors">
                  Privacy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
