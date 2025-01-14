import React, { useState, useEffect } from "react";
import "../../../index.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../AppContext";

const DonationCart = ({setCurrentStep}) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {refetch, setRefetch} = useAppContext()

  const apiUrl = import.meta.env.VITE_ICHARMS_URL;
  const apiToken = import.meta.env.VITE_ICHARMS_API_KEY;

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
  const decreaseQuantity = async (event) => {
    const cartId = event.target.getAttribute("data-cart-id");
    const currentQuantity = parseInt(
      event.target.getAttribute("data-cart-quantity"),
      10
    );
    const newQuantity = currentQuantity - 1;

    if (newQuantity > 0) {
      updateCartQuantity(cartId, newQuantity);
    } else {
      removeCartItem(cartId);
    }

setRefetch(!refetch)

  };
  const removeCartItem = async (cartId) => {
    console.log("Removing item with ID:", cartId);
    try {
      const response = await fetch(`${apiUrl}cart/delete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart_id: cartId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };
  const updateCartQuantity = async (cartId, newQuantity) => {
    try {
      const response = await fetch(`${apiUrl}cart/quantity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart_id: cartId, quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };
  const pushParticipantNames = async (cartId, plaqueNames) => {
    try {
      // Input validation
      if (!cartId || !plaqueNames) {
        throw new Error("Missing required data: cart ID or plaque names");
      }
  
      const response = await fetch(`${apiUrl}cart/participant`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_id: cartId,
          participant_name: plaqueNames.trim(),
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }
  
      // if (data.success === false) {
      //   alert("Plaque names already updated for this item");
      //   return false;
      // }
  
      return true;
  
    } catch (err) {
      console.error("Error pushing participant names:", err);
      throw err; // Re-throw to handle in the parent function
    }
  };
  
  const updateParticipantNames = async (event) => {
    try {
      // Input validation
      if (!cartItems?.length) {
        toast.error("No cart items found");
        return;
      }
  
      const cartData = cartItems.map(item => {
        const plaqueInputs = document.querySelectorAll(
          `input[data-cart-id="${item.cart_id}"]#plaque-name`
        );
  
        // Validate inputs exist
        if (!plaqueInputs?.length) {
          throw new Error(`No plaque inputs found for cart ID: ${item.cart_id}`);
        }
  
        const plaqueNames = Array.from(plaqueInputs)
          .map(input => input.value?.trim())
          .filter(name => name !== "")
          .join(", ");
  
        return {
          cart_id: item.cart_id,
          participant_name: plaqueNames
        };
      });
  
      // Validate all items have names
      const missingNames = cartData.find(item => !item.participant_name);
      if (missingNames) {
        toast.error("Please enter plaque names for all programs!");
        return;
      }
  
      // Track success for all updates
      let allUpdatesSuccessful = true;
  
      // Update each cart item
      for (const item of cartData) {
        const success = await pushParticipantNames(
          item.cart_id, 
          item.participant_name
        );
        if (!success) {
          allUpdatesSuccessful = false;
          break;
        }
      }
  
      // Only proceed if all updates were successful
      if (allUpdatesSuccessful) {
        // alert("All plaque names updated successfully");
        // Safely update step
        setCurrentStep(prevStep => {
          try {
            return prevStep + 1;
          } catch (err) {
            console.error("Error updating step:", err);
            return prevStep;
          }
        });
      }
  
    } catch (err) {
      console.error("Error updating participant names:", err);
      toast.error(`Error: ${err.message}`);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="max-w-2xl mx-auto rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Your Donation Cart
      </h1>

      {error ? (
        <div className="text-red-600 font-medium text-center mb-4">
          Error: {error}
        </div>
      ) : loading ? (
        <li className="relative flex flex-col gap-4 border border-gray-300 rounded-lg p-4">
        {/* Top Section Skeleton */}
        <div className="flex items-start gap-4">
          {/* Image Skeleton */}
          <div className="w-24 h-24 rounded-md bg-slate-400 animate-pulse" />
          
          {/* Details Skeleton */}
          <div className="flex-1">
            <div className="h-6 w-4/5 rounded-lg bg-slate-400 mb-2 animate-pulse" />
            <div className="h-5 w-3/5 rounded-lg bg-slate-400 mb-2 animate-pulse" />
            <div className="h-5 w-2/5 rounded-lg bg-slate-400 animate-pulse" />
          </div>
        </div>
      
        {/* Quantity Controls Section Skeleton */}
        <div className="flex items-center mb-4">
          {/* Toggle Section Skeleton */}
          <div className="flex items-center w-2/5 justify-center">
            <div className="h-5 w-4/5 rounded-lg bg-slate-400 animate-pulse" />
          </div>
      
          {/* Input Field Skeleton */}
          <div className="ml-4 h-10 w-3/5 rounded bg-slate-400 animate-pulse" />
      
          {/* Delete Button Skeleton */}
          <div className="ml-2 h-8 w-8 rounded bg-slate-400 animate-pulse" />
        </div>
      </li>
      ) : cartItems.length > 0 ? (
        <ul id="cart" className="space-y-4">
          {cartItems.map((item) => (
            <>
              <li
                className="flex flex-col gap-4 border border-gray-300 rounded-lg p-4"
                key={item.cart_id}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={item.program_image}
                    alt={item.program_name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {item.program_name}
                    </h3>
                    <p className="text-gray-700">
                      Donation Amount: £{item.donation_amount * item.quantity}
                    </p>
                    <p className="text-gray-700">Quantity: {item.quantity}</p>
                    {/* <p className="text-gray-700">Country: {item.country_name}</p> */}
                  </div>
                </div>

                {Array.from({ length: item.quantity }).map((_, index) => (
                  <div
                    className="flex items-center mb-4"
                    key={`${item.cart_id}-${index}`}
                  >
                    <div className="flex items-center w-2/5 justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        Donate For Yourself
                      </span>
                      <label className="inline-flex items-center ml-2 cursor-pointer">
                        <input
                          type="checkbox"
                          data-cart-id={item.cart_id}
                          data-index={index}
                          required
                          data-cart-quantity={item.quantity}
                          className="sr-only peer plaque-input"
                        />
                        <div className="relative w-11 h-6  rounded-full peer bg-gray-200 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <input
                      type="text"
                      placeholder="Plaque Name"
                      id="plaque-name"
                      data-cart-id={item.cart_id}
                      data-index={index}
                      className="ml-4 p-2 border rounded w-3/5"
                    />

                    <button
                      onClick={decreaseQuantity}
                      className="decrease-quantity text-red-600 ml-2 w-1/5 text-center"
                      data-cart-id={item.cart_id}
                      data-cart-quantity={item.quantity}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                
              </li>
            </>
          ))}

          <div className="border rounded-lg border-black p-4 text-center">
            <h2>
              Total Donation Amount
              <span className="font-bold">
                {" "}
                : £
                {cartItems
                  .reduce(
                    (total, item) =>
                      total + item.donation_amount * item.quantity,
                    0
                  )
                  .toFixed(2)}{" "}
              </span>
            </h2>
          </div>
          <div className="flex justify-evenly mt-6">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
              <Link to="/donation-portal">Add Another Program</Link>
            </button>
            <button
              onClick={updateParticipantNames}
              data-cart-ids={JSON.stringify(
                cartItems.map((item) => item.cart_id)
              )}
        
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Proceed
            </button>
          </div>
        </ul>
      ) : (
        <div>
          <p className="text-center text-gray-600">No items in your cart.</p>
          <div className="flex justify-evenly mt-6">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
              <Link to="/donation-portal">Add Programs</Link>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationCart;
