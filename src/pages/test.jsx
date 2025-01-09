import React, { useState } from "react";
import axios from "axios";

const StripePaymentComponent = () => {
  const [response, setResponse] = useState(null); // State to store the response
  const [error, setError] = useState(null); // State to store errors (if any)
  
  const handlePayment = async () => {
    console.log(import.meta.env.VITE_ICHARMS_API_KEY,"n,,");
    const requestData = {
      session_id: "session-1735551835657-9z91k2e65zd",
      stripe_secret: "pk_test_51QY5CeCmfoaSmnTa94WUXrhO9zR2vC4n4ZBEreiQfOl0qEVHTCt7yhnlWfdaqaC7vRho7W8PebOemxbt2Hu1g9Aj005veUXel4",
    };
    

    try {
      const res = await axios.post(
        "https://icharms.mysadaqahonline.com/api/v1/payment/stripe/init",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.PUBLIC_ICHARMS_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res);
      
      setResponse(res); // Save the response data
      setError(null); // Clear previous errors
    } catch (err) {
      setError(err.message); // Store error message
      console.error("Error during the request:", err);
    }
  };

  return (
    <div>
      <button onClick={handlePayment}>Initiate Payment</button>
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default StripePaymentComponent;
