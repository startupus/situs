import React from 'react';
import { RichText } from '../editing-components';
import { Text } from '../editing-components';
import { Image } from '../editing-components';

export interface TestimonialBlockProps {
  testimonials: Array<{
    image: string;
    name: string;
    position: string;
    details: string;
  }>;
  onUpdate: (updates: Partial<TestimonialBlockProps>) => void;
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({
  testimonials,
  onUpdate
}) => {
  const updateTestimonial = (index: number, updates: Partial<TestimonialBlockProps['testimonials'][0]>) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], ...updates };
    onUpdate({ testimonials: newTestimonials });
  };

  return (
    <section className="pb-20 pt-20 dark:bg-gray-900 lg:pb-[120px] lg:pt-[120px]">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative flex justify-center">
              <div className="relative w-full pb-16 md:w-11/12 lg:w-10/12 xl:w-8/12">
                <div className="w-full items-center md:flex">
                  <div className="relative mb-12 w-full max-w-[310px] md:mb-0 md:mr-12 md:max-w-[250px] lg:mr-14 lg:max-w-[280px] 2xl:mr-16">
                    <Image
                      propName={`testimonials.${index}.image`}
                      value={testimonial.image}
                      onChange={(value) => updateTestimonial(index, { image: value })}
                      imageClassName="w-full rounded-lg"
                      alt={testimonial.name}
                    />
                  </div>
                  
                  <div className="w-full">
                    <div className="mb-6 flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-yellow-400"
                          >
                            <path d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    
                    <Text
                      propName={`testimonials.${index}.details`}
                      value={testimonial.details}
                      onChange={(value) => updateTestimonial(index, { details: value })}
                      renderBlock={({ children, onDoubleClick, className }) => (
                        <p
                          onDoubleClick={onDoubleClick}
                          className={`mb-6 text-base text-body-color dark:text-gray-300 ${className}`}
                        >
                          "{children}"
                        </p>
                      )}
                    />
                    
                    <div className="flex items-center">
                      <div className="mr-4">
                        <RichText
                          propName={`testimonials.${index}.name`}
                          value={testimonial.name}
                          onChange={(value) => updateTestimonial(index, { name: value })}
                          renderBlock={({ children, onDoubleClick, className }) => (
                            <h4
                              onDoubleClick={onDoubleClick}
                              className={`text-lg font-semibold text-dark dark:text-white ${className}`}
                            >
                              {children}
                            </h4>
                          )}
                        />
                        
                        <Text
                          propName={`testimonials.${index}.position`}
                          value={testimonial.position}
                          onChange={(value) => updateTestimonial(index, { position: value })}
                          renderBlock={({ children, onDoubleClick, className }) => (
                            <p
                              onDoubleClick={onDoubleClick}
                              className={`text-sm text-body-color dark:text-gray-400 ${className}`}
                            >
                              {children}
                            </p>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialBlock; 