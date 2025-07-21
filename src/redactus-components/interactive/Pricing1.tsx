import React, { useState } from 'react';

export interface Pricing1Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  pricingPlans?: PricingPlan[];
}

export interface PricingPlan {
  id: number;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
}

const Pricing1: React.FC<Pricing1Props> = ({
  sectionTitle = "Simple Pricing",
  sectionSubtitle = "Choose the perfect plan for your business",
  pricingPlans = [
    {
      id: 1,
      name: "Starter",
      price: 29,
      period: "month",
      features: ["10 projects", "5GB storage", "Email support", "Basic analytics"],
      buttonText: "Get Started"
    },
    {
      id: 2,
      name: "Professional",
      price: 79,
      period: "month",
      features: ["Unlimited projects", "100GB storage", "Priority support", "Advanced analytics", "Team collaboration"],
      isPopular: true,
      buttonText: "Start Free Trial"
    },
    {
      id: 3,
      name: "Enterprise",
      price: 199,
      period: "month",
      features: ["Unlimited everything", "1TB storage", "24/7 phone support", "Custom analytics", "Advanced security", "Dedicated manager"],
      buttonText: "Contact Sales"
    }
  ]
}) => {
  const [isYearly, setIsYearly] = useState(false);
  
  return (
    <section className="bg-white py-16 dark:bg-dark lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 
            contentEditable 
            suppressContentEditableWarning={true}
            className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-5xl"
          >
            {sectionTitle}
          </h2>
          <p 
            contentEditable 
            suppressContentEditableWarning={true}
            className="mx-auto max-w-2xl text-lg text-body-color dark:text-dark-6"
          >
            {sectionSubtitle}
          </p>
        </div>
        
        {/* Billing Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-dark-3">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                !isYearly 
                ? 'bg-white text-dark shadow-md dark:bg-dark dark:text-white' 
                : 'text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white'
              }`}
            >
              <span contentEditable suppressContentEditableWarning={true}>
                Monthly
              </span>
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                isYearly 
                ? 'bg-white text-dark shadow-md dark:bg-dark dark:text-white' 
                : 'text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white'
              }`}
            >
              <span contentEditable suppressContentEditableWarning={true}>
                Yearly
              </span>
              <span className="ml-1 text-xs text-green-500">Save 20%</span>
            </button>
          </div>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:bg-dark-2 ${
                plan.isPopular ? 'border-2 border-primary scale-105' : 'border border-gray-200 dark:border-dark-3'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
                    <span contentEditable suppressContentEditableWarning={true}>
                      Most Popular
                    </span>
                  </span>
                </div>
              )}
              
              <div className="mb-8 text-center">
                <h3 
                  contentEditable 
                  suppressContentEditableWarning={true}
                  className="mb-4 text-2xl font-bold text-dark dark:text-white"
                >
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-dark dark:text-white">
                    ${isYearly ? Math.round(plan.price * 0.8) : plan.price}
                  </span>
                  <span className="text-lg text-body-color dark:text-dark-6">
                    /{plan.period}
                  </span>
                </div>
                {isYearly && (
                  <p className="text-sm text-green-500">
                    <span contentEditable suppressContentEditableWarning={true}>
                      Save ${Math.round(plan.price * 0.2 * 12)} per year
                    </span>
                  </p>
                )}
              </div>
              
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg 
                      className="mr-3 h-5 w-5 text-green-500" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span 
                      contentEditable 
                      suppressContentEditableWarning={true}
                      className="text-body-color dark:text-dark-6"
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full rounded-lg py-4 font-semibold transition-all hover:shadow-lg ${
                  plan.isPopular 
                  ? 'bg-primary text-white hover:bg-primary/90' 
                  : 'bg-gray-100 text-dark hover:bg-gray-200 dark:bg-dark-3 dark:text-white dark:hover:bg-dark-4'
                }`}
              >
                <span contentEditable suppressContentEditableWarning={true}>
                  {plan.buttonText}
                </span>
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p 
            contentEditable 
            suppressContentEditableWarning={true}
            className="text-body-color dark:text-dark-6"
          >
            All plans include 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing1; 