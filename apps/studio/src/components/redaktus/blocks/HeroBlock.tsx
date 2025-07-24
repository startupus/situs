import React from 'react';
import { RichText } from '../editing-components';
import { Text } from '../editing-components';
import { Image } from '../editing-components';

export interface HeroBlockProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  heroImage: string;
  clientLogos: string[];
  onUpdate: (updates: Partial<HeroBlockProps>) => void;
}

export const HeroBlock: React.FC<HeroBlockProps> = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonUrl,
  secondaryButtonText,
  secondaryButtonUrl,
  heroImage,
  clientLogos,
  onUpdate
}) => {
  return (
    <div className="relative bg-white pb-[110px] pt-[120px] dark:bg-slate-900 lg:pt-[150px]">
      <div className="container mx-auto px-4">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-5/12">
            <div className="hero-content">
              <RichText
                propName="title"
                value={title}
                onChange={(value) => onUpdate({ title: value })}
                renderBlock={({ children, onDoubleClick, className }) => (
                  <h1
                    onDoubleClick={onDoubleClick}
                    className={`mb-5 text-4xl font-bold leading-[1.208] text-slate-900 dark:text-white sm:text-[42px] lg:text-[40px] xl:text-5xl ${className}`}
                  >
                    {children}
                  </h1>
                )}
              />
              
              <Text
                propName="subtitle"
                value={subtitle}
                onChange={(value) => onUpdate({ subtitle: value })}
                renderBlock={({ children, onDoubleClick, className }) => (
                  <p
                    onDoubleClick={onDoubleClick}
                    className={`mb-8 max-w-[480px] text-base text-slate-600 dark:text-slate-400 ${className}`}
                  >
                    {children}
                  </p>
                )}
              />
              
              <ul className="flex flex-wrap items-center gap-4">
                <li>
                  <Text
                    propName="primaryButtonText"
                    value={primaryButtonText}
                    onChange={(value) => onUpdate({ primaryButtonText: value })}
                    renderBlock={({ children, onDoubleClick, className }) => (
                      <a
                        href="#"
                        onDoubleClick={onDoubleClick}
                        className={`inline-flex items-center justify-center rounded-md bg-[#3056D3] px-6 py-3 text-center text-base font-medium text-white shadow-lg hover:bg-[#1B44C8] hover:shadow-xl transition-all duration-200 lg:px-7 ${className}`}
                      >
                        {children}
                      </a>
                    )}
                  />
                </li>
                <li>
                  <Text
                    propName="secondaryButtonText"
                    value={secondaryButtonText}
                    onChange={(value) => onUpdate({ secondaryButtonText: value })}
                    renderBlock={({ children, onDoubleClick, className }) => (
                      <a
                        href="#"
                        onDoubleClick={onDoubleClick}
                        className={`inline-flex items-center justify-center rounded-md border-2 border-[#3056D3] bg-transparent px-5 py-3 text-center text-base font-medium text-[#3056D3] hover:bg-[#3056D3] hover:text-white transition-all duration-200 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-slate-900 ${className}`}
                      >
                        {children}
                      </a>
                    )}
                  />
                </li>
              </ul>
              
              <div className="clients pt-16">
                <h6 className="mb-6 flex items-center text-xs font-normal text-slate-600 dark:text-slate-400">
                  Some Of Our Clients
                  <span className="ml-3 inline-block h-px w-8 bg-slate-600 dark:bg-slate-400"></span>
                </h6>

                <div className="flex items-center space-x-4">
                  {clientLogos.map((logo, index) => (
                    <Image
                      key={index}
                      propName={`clientLogos.${index}`}
                      value={logo}
                      onChange={(value) => {
                        const newLogos = [...clientLogos];
                        newLogos[index] = value;
                        onUpdate({ clientLogos: newLogos });
                      }}
                      imageClassName="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                      alt={`Client logo ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden px-4 lg:block lg:w-1/12"></div>
          
          <div className="w-full px-4 lg:w-6/12">
            <div className="lg:ml-auto lg:text-right">
              <div className="relative z-10 inline-block pt-11 lg:pt-0">
                <Image
                  propName="heroImage"
                  value={heroImage}
                  onChange={(value) => onUpdate({ heroImage: value })}
                  imageClassName="max-w-full lg:ml-auto"
                  alt="Hero"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBlock; 