import React, { useState } from "react";
import GetStartedModal from "./pricingmodel";

const Pricing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: string;
    color: string;
  } | null>(null);

  // ✅ Subscription Plans
  const plans = [
    {
      name: "Free",
      price: "₹0 / month",
      color: "#4CAF50", // green
      features: [
        "10 User accounts",
        "Unlimited Records",
        "Full Customer Management with Smart Filters",
        "Advanced Reports & Analytics",
        "Smart Notifications & Reminders",
        "Priority Security Features",
        "24/7 Premium Support",
        "All Gold Features Included Free",
      ],
    },
    {
      name: "Bronze",
      price: "₹199 / month",
      color: "#cd7f32",
      features: [
        "3 User accounts",
        "500 Transactions (Debit/Credit) per month",
        "75 New customers per month",
        "Basic Reports",
        "Email & Call Support (11 AM – 6 PM)",
      ],
    },
    {
      name: "Silver",
      price: "₹499 / month",
      color: "#c0c0c0",
      popular: true, // ✅ Most Popular
      features: [
        "6 User accounts",
        "1,500 Records per month",
        "Advanced Customer Management & Search",
        "Advanced Reports & Analytics",
        "Email Support (11 AM – 6 PM)",
      ],
    },
    {
      name: "Gold",
      price: "₹999 / month",
      color: "#ffd700",
      features: [
        "10 User accounts",
        "Unlimited Records",
        "Full Customer Management with Smart Filters",
        "Advanced Reports & Analytics",
        "Smart Notifications & Reminders",
        "Priority Security Features",
        "24/7 Premium Support",
      ],
    },
  ];

  const handleGetStarted = (plan: { name: string; price: string; color: string }) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Subscription Plans
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-500">
          Choose the plan that best suits your business needs.
        </p>
      </div>

      {/* Plans grid - 4 columns */}
      <div className="grid gap-6 md:grid-cols-4 max-w-screen-xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden w-full max-w-xs mx-auto"
            style={{ borderTop: `4px solid ${plan.color}` }}
          >
            {/* ✅ Popular Badge */}
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-bl-md">
                Most Popular
              </div>
            )}
            <div className="p-6 text-center flex flex-col h-full">
              <h2
                className="text-xl font-bold mb-3"
                style={{ color: plan.color }}
              >
                {plan.name}
              </h2>
              <p className="text-2xl font-extrabold text-gray-900 mb-4">
                {plan.price}
              </p>
              <ul className="text-gray-700 text-sm flex-grow space-y-3 text-left">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 border-b border-gray-200 pb-1 last:border-b-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleGetStarted(plan)}
                className="mt-6 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400"
              >
                {plan.name === "Free" ? "Start Free Plan" : "Get Started"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <GetStartedModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default Pricing;
