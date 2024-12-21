import React from "react";
import Header from "../components/Donation-portal/Header";
import Footer from "../components/Donation-portal/Footer";
import CartData from "../components/Donation-portal/Cart";
import { useAppContext } from "../components/AppContext";

const donationPortalLayout = ({ children }) => {
  // const {cartCount, setCartCount} = useAppContext()
  return (
    <div>
      <Header />
      {/* <CartData cartCount={cartCount} /> */}
      {children}
      <Footer />
    </div>
  );
};

export default donationPortalLayout;
