import React from 'react';
import { ChevronLeft } from 'lucide-react';

const PaymentForm = () => {
  return (
    <div className="h-[100vh] w-full bg-black overflow-hidden">
      <div className="grid md:grid-cols-2 h-full">
        {/* Left Section */}
        <div className="h-full p-6 md:p-12 lg:p-24 flex flex-col">
          <div className="flex items-center gap-4 mb-12">
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <ChevronLeft className="text-white" size={20} />
            </button>
            <span className="px-3 py-1 text-sm bg-orange-500 rounded-md text-white">TEST MODE</span>
          </div>
          
          <div className="flex-grow flex flex-col justify-center text-white">
            <h2 className="text-lg font-normal mb-2">Food Packs</h2>
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">£100.00</div>
            <p className="text-gray-400">For Country : Pakistan</p>
          </div>
        </div>

        {/* Right Section - Scrollable Content */}
        <div className="bg-white h-full overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6 md:p-12 lg:p-24">
            <h1 className="text-2xl font-semibold mb-8">Pay with card</h1>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-black focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Card information</label>
                <div className="border rounded-md focus-within:ring-2 focus-within:ring-black">
                  <input 
                    type="text" 
                    placeholder="1234 1234 1234 1234" 
                    className="w-full p-3 border-b focus:outline-none" 
                  />
                  <div className="grid grid-cols-2">
                    <input 
                      type="text" 
                      placeholder="MM / YY" 
                      className="p-3 border-r focus:outline-none" 
                    />
                    <input 
                      type="text" 
                      placeholder="CVC" 
                      className="p-3 focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Cardholder name</label>
                <input 
                  type="text" 
                  placeholder="Full name on card" 
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-black focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Billing address</label>
                <select className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-black focus:outline-none">
                  <option>India</option>
                </select>
                
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Address line 1" 
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-black focus:outline-none" 
                  />
                  <input 
                    type="text" 
                    placeholder="Address line 2" 
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-black focus:outline-none" 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="City" 
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-black focus:outline-none" 
                    />
                    <input 
                      type="text" 
                      placeholder="PIN" 
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-black focus:outline-none" 
                    />
                  </div>
                  <select className="w-full p-3 border rounded-md focus:ring-2 focus:ring-black focus:outline-none">
                    <option>State</option>
                  </select>
                </div>
              </div>

              <button className="w-full bg-black text-white py-4 rounded-md hover:bg-gray-800 transition-colors">
                Pay
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2 mb-2">
                Powered by
                <span className="font-medium">stripe</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button className="hover:text-gray-700 transition-colors">Terms</button>
                <button className="hover:text-gray-700 transition-colors">Privacy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;