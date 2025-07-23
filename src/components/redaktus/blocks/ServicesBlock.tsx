import React from 'react';
import { RichText } from '../editing-components';
import { Text } from '../editing-components';

export interface ServiceItem {
  title: string;
  details: string;
  icon: string;
}

export interface ServicesBlockProps {
  sectionTitle: string;
  sectionSubtitle: string;
  sectionDescription: string;
  services: ServiceItem[];
  onUpdate: (updates: Partial<ServicesBlockProps>) => void;
}

export const ServicesBlock: React.FC<ServicesBlockProps> = ({
  sectionTitle,
  sectionSubtitle,
  sectionDescription,
  services,
  onUpdate
}) => {
  const updateService = (index: number, updates: Partial<ServiceItem>) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], ...updates };
    onUpdate({ services: newServices });
  };

  return (
    <section className="pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-12 max-w-[510px] text-center lg:mb-20">
              <Text
                propName="sectionSubtitle"
                value={sectionSubtitle}
                onChange={(value) => onUpdate({ sectionSubtitle: value })}
                renderBlock={({ children, onDoubleClick, className }) => (
                  <span
                    onDoubleClick={onDoubleClick}
                    className={`mb-2 block text-lg font-semibold text-primary ${className}`}
                  >
                    {children}
                  </span>
                )}
              />
              
              <RichText
                propName="sectionTitle"
                value={sectionTitle}
                onChange={(value) => onUpdate({ sectionTitle: value })}
                renderBlock={({ children, onDoubleClick, className }) => (
                  <h2
                    onDoubleClick={onDoubleClick}
                    className={`mb-3 text-3xl font-bold leading-[1.2] text-dark dark:text-white sm:text-4xl md:text-[40px] ${className}`}
                  >
                    {children}
                  </h2>
                )}
              />
              
              <Text
                propName="sectionDescription"
                value={sectionDescription}
                onChange={(value) => onUpdate({ sectionDescription: value })}
                renderBlock={({ children, onDoubleClick, className }) => (
                  <p
                    onDoubleClick={onDoubleClick}
                    className={`text-base text-gray-600 dark:text-gray-300 ${className}`}
                  >
                    {children}
                  </p>
                )}
              />
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          {services.map((service, index) => (
            <div key={index} className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mb-9 rounded-[20px] bg-white p-10 shadow-lg hover:shadow-xl dark:bg-gray-800 md:px-7 xl:px-10">
                <div className="mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-primary">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-white"
                  >
                    <path d="M21.0375 1.2374C11.8125 -0.393851 2.92503 5.7374 1.29378 14.9624C0.450029 19.4061 1.46253 23.9624 4.05003 27.6749C6.63753 31.4436 10.5188 33.9186 14.9625 34.7624C15.975 34.9311 16.9875 35.0436 18 35.0436C26.0438 35.0436 33.2438 29.2499 34.7625 21.0374C36.3938 11.8124 30.2625 2.9249 21.0375 1.2374ZM32.2313 20.5874C32.175 21.0374 32.0625 21.4874 31.95 21.8811L19.2375 17.0999V3.5999C19.6875 3.65615 20.1375 3.7124 20.5313 3.76865C28.4063 5.1749 33.6375 12.7124 32.2313 20.5874ZM16.7063 3.5999V16.7624H3.60003C3.65628 16.3124 3.71253 15.8624 3.76878 15.4124C4.95003 8.83115 10.4063 4.10615 16.7063 3.5999ZM15.4125 32.2311C11.5875 31.5561 8.32503 29.4186 6.13128 26.2124C4.66878 24.1311 3.82503 21.7124 3.60003 19.2374H17.775L31.05 24.2436C28.2938 29.9811 21.9375 33.4686 15.4125 32.2311Z" />
                  </svg>
                </div>
                
                <RichText
                  propName={`services.${index}.title`}
                  value={service.title}
                  onChange={(value) => updateService(index, { title: value })}
                  renderBlock={({ children, onDoubleClick, className }) => (
                    <h4
                      onDoubleClick={onDoubleClick}
                      className={`mb-[14px] text-2xl font-semibold text-dark dark:text-white ${className}`}
                    >
                      {children}
                    </h4>
                  )}
                />
                
                <Text
                  propName={`services.${index}.details`}
                  value={service.details}
                  onChange={(value) => updateService(index, { details: value })}
                  renderBlock={({ children, onDoubleClick, className }) => (
                    <p
                      onDoubleClick={onDoubleClick}
                      className={`text-gray-600 dark:text-gray-300 ${className}`}
                    >
                      {children}
                    </p>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesBlock; 