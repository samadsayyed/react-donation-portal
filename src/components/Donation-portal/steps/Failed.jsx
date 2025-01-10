import React, { useEffect } from "react";
import "../../../index.css"
import { Link } from "react-router-dom";

const Failed = () => {
  const referenceId = Array(20)
  .fill(0)
  .map(() => "12345abcde"[Math.floor(Math.random() * 10)])
  .join("");
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Transaction Failed</h2>

        <div className="flex justify-center items-center bg-red-500  w-20 h-20 rounded-full mx-auto mb-6">
        <img src="/wrong.gif" alt="Payment Failed" />
        </div>

        <p className="text-gray-700 mb-6">Order #SO-{referenceId}</p>

        <button className="bg-[#02343F] hover:bg-[#02343fd9] text-white font-bold py-2 px-4 rounded w-full">
          <Link to="/" className="text-white">
            Return Home
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Failed;
