import React, { useState } from "react";
import { Check, Smartphone, Banknote, Wallet, QrCode } from "lucide-react";

const Payment: React.FC = () => {
  const [method, setMethod] = useState("upi");

  const handlePayment = () => {
    alert(`✅ Payment initiated using ${method.toUpperCase()} method!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Container */}
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Complete Your Subscription</h1>
          <p className="text-sm text-blue-100 mt-1">
            Secure payment powered by RecordBook
          </p>
        </div>

        {/* Plan Summary */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Selected Plan
          </h2>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Gold Plan</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Check className="text-green-500" size={16} />
                30-day free trial included
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">₹999</p>
              <span className="text-sm text-gray-500">per month</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Choose Payment Method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* UPI */}
            <button
              onClick={() => setMethod("upi")}
              className={`flex items-center gap-3 p-4 border rounded-xl transition-all ${
                method === "upi"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <Smartphone
                size={22}
                className={method === "upi" ? "text-blue-600" : "text-gray-500"}
              />
              <span className="font-medium">UPI (Google Pay / PhonePe)</span>
            </button>

            {/* Net Banking */}
            <button
              onClick={() => setMethod("netbanking")}
              className={`flex items-center gap-3 p-4 border rounded-xl transition-all ${
                method === "netbanking"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <Banknote
                size={22}
                className={
                  method === "netbanking" ? "text-blue-600" : "text-gray-500"
                }
              />
              <span className="font-medium">Net Banking</span>
            </button>

            {/* Wallet */}
            <button
              onClick={() => setMethod("wallet")}
              className={`flex items-center gap-3 p-4 border rounded-xl transition-all ${
                method === "wallet"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <Wallet
                size={22}
                className={
                  method === "wallet" ? "text-blue-600" : "text-gray-500"
                }
              />
              <span className="font-medium">Wallets (Paytm, Amazon Pay)</span>
            </button>

            {/* QR Code */}
            <button
              onClick={() => setMethod("qrcode")}
              className={`flex items-center gap-3 p-4 border rounded-xl transition-all ${
                method === "qrcode"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <QrCode
                size={22}
                className={
                  method === "qrcode" ? "text-blue-600" : "text-gray-500"
                }
              />
              <span className="font-medium">Scan QR</span>
            </button>
          </div>
        </div>

        {/* Pay Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all"
          >
            Proceed to Pay ₹999
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            By continuing, you agree to our Terms & Conditions and Privacy
            Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
