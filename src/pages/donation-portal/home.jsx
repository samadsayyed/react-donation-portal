import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "../../index.css";
import DonationPortalLayout from "../../layout/donation-portal";
import { apiToken, apiUrl } from "../../utils/data.js";
import { useAppContext } from "../../components/AppContext";
import CartData from "../../components/Donation-portal/Cart";

// Axios instance for API calls
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  },
});

// Helper function to generate a session ID
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
  const expiryTime = timestamp + 24 * 60 * 60 * 1000; // 1 day

  localStorage.setItem(
    "sessionIdData",
    JSON.stringify({ sessionId: newSessionId, expiry: expiryTime })
  );

  return newSessionId;
};

const ProgramsList = () => {
  const [sessionId, setSessionId] = useState(generateSessionId());
    const {cartCount, setCartCount} = useAppContext()
  // Fetch programs
  const {
    data: programs,
    isLoading: programsLoading,
    error: programsError,
  } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const response = await axiosInstance.get("program-list?limit=1000");
      return response.data;
    },
  });


  console.log(programs,"programs");
  

  // Fetch cart items
  const fetchCart = async () => {
    // console.log("Fetching cart data...");

    const response = await axiosInstance.post("cart/cart", {
      session_id: sessionId,
    });
    // console.log("Cart response:", response);
    return response.data.cart || [];
  };

  const { data: cartItems, refetch: refetchCart, isLoading: cartLoading, error: cartError } = useQuery({
    queryKey: ["cart", sessionId],
    queryFn: fetchCart,
    // enabled: !!sessionId,
    onSuccess: (data) => {
      console.log("Cart fetched successfully");
      console.log(data, "Fetched cart data");
      setCartCount(data.length); // Assuming data is an array
    },
  });

  useEffect(() => {
    setCartCount(cartItems?.length || 0)
  }, [cartItems])
  

  // Mutation for adding to cart
  const addToCartMutation = useMutation({
    mutationFn: async (cartData) => {
      const response = await axiosInstance.post("cart/create", cartData);
      return response.data;
    },
    onSuccess: () => {
      refetchCart(); // Refetch cart after adding an item
    },
  });

  const handleAddToCart = (event) => {
    const programRate = event.currentTarget.getAttribute("data-program-rate");
    const programId = event.currentTarget.getAttribute("data-program-id");
    const programQuantity = event.currentTarget.getAttribute("data-program-quantity");
    const programCountry = event.currentTarget.getAttribute("data-program-country");

    const cartData = {
      donation_period: "one-off",
      currency: "GBP",
      currency_id: 1,
      category_id: 2,
      program_id: programId,
      country_id: programCountry,
      quantity: programQuantity,
      donation_amount: programRate,
      donation_pound_amount: programRate,
      participant_name: "",
      session_id: sessionId,
    };

    addToCartMutation.mutate(cartData);
  };

  // Error and Loading States
  if (programsLoading) {
    return    <div className="flex justify-center items-center top-1/2 absolute right-1/2">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-300 border-t-teal-900 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img className=" rounded-full bg-gray-700" src="/assets/images/logo.png" alt="" height="56px" width="56px" />
            </div>
          </div>
        </div>
      </div>;
  }

  if (programsError) {
    return <div>Error fetching programs: {programsError.message}</div>;
  }

  return (
    <DonationPortalLayout>
      <CartData />
      <div className="container mx-auto max-w-6xl px-4 py-20">
        <h1 className="text-3xl font-bold text-center mb-10 text-teal-900">
          Select Program
        </h1>

        {addToCartMutation.isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {programs
        ?.filter((program) => program.program_is_animal === "Y")
        ?.map((program) => (
          <div
            key={program.program_id}
            className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative">
              <img
                src={program.image}
                alt={program.program_name}
                className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                {/* <hr className="h-4 w-4 text-teal-700" /> */}
                <span className="text-sm font-medium text-teal-900">
                  {program.country_name}
                </span>
              </div>
            </div>

            <div className="bg-teal-900 p-5 space-y-3">
              <div className="space-y-1">
                <h3 className="text-white font-semibold text-lg line-clamp-2">
                  {program.program_name}
                </h3>
                <p className="text-white text-2xl font-bold">
                  £{program.program_rate}
                </p>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-cream hover:bg-cream/90 text-teal-900 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                style={{ backgroundColor: "#F5E6D3" }}
                data-program-rate={program.program_rate}
                data-program-id={program.program_id}
                data-program-quantity={1}
                data-program-country={program.country_id}
              >
                Add to Cart
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
    </div>
      </div>
    </DonationPortalLayout>
  );
};

export default ProgramsList;
