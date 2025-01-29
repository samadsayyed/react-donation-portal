// cartUtils.js

import axios from "axios";
import { apiUrl, apiToken } from "../utils/data.js";

// Function to fetch cart data
export const fetchCart = async (sessionId) => {
  try {
    const response = await axios.post(
      `${apiUrl}cart/cart`,
      { session_id: sessionId },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.cart || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching cart");
  }
};

// Function to remove an item from the cart
export const removeCartItemMutation = async (cartId) => {
  try {
    const response = await axios.post(
      `${apiUrl}cart/delete`,
      { cart_id: cartId },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error removing cart item");
  }
};

// Function to update cart item quantity
export const updateCartQuantityMutation = async (cartId, newQuantity) => {
    
  try {
    const response = await axios.post(
      `${apiUrl}cart/quantity`,
      { cart_id: cartId, quantity: (newQuantity) },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    return response.data;
  } catch (error) {

    throw new Error(error.response?.data?.message || "Error updating cart quantity");
  }
};


// utils/session.js

export const generateSessionId = () => {
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
  