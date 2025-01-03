import React from "react";
import "../../../index.css";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Thank You For Your Donation</h2>
        <p className="text-[100px]">✅</p>

        <p className="text-gray-700 mb-6">Order #123RGR231567Y Confirmed</p>

        <button className="bg-[#02343F] hover:bg-[#02343fd9] text-white font-bold py-2 px-4 rounded w-full">
          <Link to="/" className="text-white">
            Return Home
          </Link>
        </button>

        <a
          href="/dashboard/reports"
          className="text-gray-500 hover:text-gray-700 text-sm block mt-4"
        >
          View Receipt
        </a>
      </div>
    </div>
  );
};

export default Success;
