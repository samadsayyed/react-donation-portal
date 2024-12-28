import { useState } from "react";
import axios from "axios";
function App() {
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:3001/paypal/payment");
      if (res && res.data) {
        window.location.href = res.data.links[1].href;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <button onClick={handlePayment}>Proceed to Payment</button>
    </>
  );
}
export default App;
