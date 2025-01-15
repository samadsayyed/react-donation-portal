import React from "react";
import { HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DonationPortalLayout from "../layout/donation-portal";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <DonationPortalLayout>
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="mb-8">
            <img
              src="/assets/images/logo.png"
              className="w-24 h-24 mx-auto text-emerald-500 animate-pulse"
              alt=""
            />
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>

          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-4 font-arabic">
            عفواً، الصفحة غير موجودة
          </p>

          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
            The path to this page seems to have been lost, but the path to
            giving is always open.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Return Home
            </button>
          </div>

          <div className="mt-12 text-gray-500 dark:text-gray-400 italic">
            "Whoever guides someone to goodness will have a reward similar to
            that of its doer"
            <div className="text-sm mt-2">- Prophet Muhammad ﷺ</div>
          </div>
        </div>
      </div>
    </DonationPortalLayout>
  );
};

export default NotFound;
