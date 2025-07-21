import React, { useState } from 'react';

export interface FAQ1Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  faqItems?: FAQItem[];
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ1: React.FC<FAQ1Props> = ({
  sectionTitle = "Frequently Asked Questions",
  sectionSubtitle = "Get answers to the most common questions",
  faqItems = [
    {
      id: 1,
      question: "What is included in the basic plan?",
      answer: "Our basic plan includes all essential features you need to get started, including up to 10 projects, 5GB storage, email support, and basic analytics."
    },
    {
      id: 2,
      question: "Can I upgrade my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect immediately and you'll only pay the difference."
    },
    {
      id: 3,
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial for all our paid plans. No credit card required to get started."
    },
    {
      id: 4,
      question: "How does billing work?",
      answer: "We bill monthly or annually depending on your chosen plan. All payments are processed securely and you can cancel anytime."
    }
  ]
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section className="bg-gray-50 py-16 dark:bg-dark-2 lg:py-20">
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
        
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            {faqItems.map((faq, index) => (
              <div 
                key={faq.id}
                className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-dark"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between text-left focus:outline-none"
                >
                  <h3 
                    contentEditable 
                    suppressContentEditableWarning={true}
                    className="text-lg font-semibold text-dark dark:text-white pr-8"
                  >
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-transform duration-300 ${
                      openIndex === index ? 'rotate-45' : ''
                    }`}>
                      <svg 
                        className="h-4 w-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                        />
                      </svg>
                    </div>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 mt-4' : 'max-h-0'
                }`}>
                  <div className="border-t border-gray-200 pt-4 dark:border-dark-3">
                    <p 
                      contentEditable 
                      suppressContentEditableWarning={true}
                      className="text-body-color dark:text-dark-6 leading-relaxed"
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ1; 