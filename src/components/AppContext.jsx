import React, { createContext, useContext, useState } from "react";

// Create the context
const AppContext = createContext();

// Custom provider component
export const AppProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [refetch, setRefetch] = useState(false);

  // You can add more global state or logic here if needed

  return (
    <AppContext.Provider value={{ cartCount, setCartCount,refetch, setRefetch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
