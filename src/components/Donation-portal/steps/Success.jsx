import React from "react";
import "../../../index.css";
import { Link } from "react-router-dom";

const Success = () => {
  const referenceId = Array(20)
  .fill(0)
  .map(() => "12345abcde"[Math.floor(Math.random() * 10)])
  .join("");
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Thank You For Your Donation</h2>
        <div className="flex justify-center items-center bg-green-600 w-20 h-20 rounded-full mx-auto mb-6">
        <img src="/assets/svg/right.gif" alt="Payment Success" />
        </div>
        <p className="text-gray-700 mb-6">Order #SO-{referenceId} Confirmed</p>

        <button className="bg-primary hover:bg-[#02343fd9] text-white font-bold py-2 px-4 rounded w-full">
          <Link to="/" className="text-white">
            Return Home
          </Link>
        </button>

        {/* <a
          href="/dashboard/reports"
          className="text-gray-500 hover:text-gray-700 text-sm block mt-4"
        >
          View Receipt
        </a> */}
      </div>
    </div>
  );
};

export default Success;
