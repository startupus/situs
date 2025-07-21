import React, { useState } from 'react';

export interface Testimonials2Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  testimonials?: DetailedTestimonialItem[];
}

export interface DetailedTestimonialItem {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
  projectType: string;
}

const Testimonials2: React.FC<Testimonials2Props> = ({
  sectionTitle = "Client Success Stories",
  sectionSubtitle = "See how we've helped businesses like yours achieve remarkable results and exceed their expectations.",
  testimonials = [
    {
      id: 1,
      name: "Jennifer Walsh",
      position: "Creative Director",
      company: "DesignStudio Pro",
      content: "The level of creativity and technical expertise this team brought to our project was extraordinary. They didn't just meet our requirements—they anticipated our needs and delivered solutions we hadn't even thought of. Our website conversion rate increased by 150% after the redesign.",
      avatar: "/images/testimonials/testimonial-01.jpg",
      rating: 5,
      projectType: "Website Redesign"
    },
    {
      id: 2,
      name: "David Thompson",
      position: "Founder & CEO",
      company: "TechFlow Solutions",
      content: "Working with this agency was a game-changer for our startup. They helped us build a scalable platform that could grow with our business. The attention to detail, communication, and post-launch support have been exceptional. Highly recommended!",
      avatar: "/images/testimonials/testimonial-02.jpg",
      rating: 5,
      projectType: "Platform Development"
    },
    {
      id: 3,
      name: "Maria Gonzalez",
      position: "Marketing Manager",
      company: "GrowthMax Agency",
      content: "Our digital marketing campaigns reached new heights thanks to their strategic approach and innovative solutions. The ROI on our marketing spend improved by 200%, and we've seen consistent growth in our client base ever since we started working together.",
      avatar: "/images/testimonials/testimonial-03.jpg",
      rating: 5,
      projectType: "Digital Marketing"
    }
  ]
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`h-6 w-6 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section id="testimonials" className="relative bg-slate-100 py-16 dark:bg-slate-900 lg:py-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center">
              <span className="mb-2 block text-lg font-semibold text-primary">
                <span 
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="inline-block"
                >
                  Testimonials
                </span>
              </span>
              <h2 
                contentEditable
                suppressContentEditableWarning={true}
                className="mb-3 text-3xl font-bold leading-[1.2] text-dark dark:text-white sm:text-4xl md:text-[40px]"
              >
                {sectionTitle}
              </h2>
              <p 
                contentEditable
                suppressContentEditableWarning={true}
                className="text-base text-body-color dark:text-dark-6"
              >
                {sectionSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <div className="mx-auto max-w-[800px] rounded-2xl bg-white p-8 shadow-xl dark:bg-dark-2 lg:p-12">
                  {/* Project Type Badge */}
                  <div className="mb-6">
                    <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                      <span contentEditable suppressContentEditableWarning={true}>
                        {testimonial.projectType}
                      </span>
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mb-6 flex items-center justify-center">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Quote */}
                  <div className="mb-8 text-center">
                    <svg
                      className="mx-auto mb-4 h-12 w-12 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.85 6.34L4.6 7.6c-.6.6-.92 1.38-.92 2.2v5.4c0 .64.26 1.2.68 1.62.42.4.98.68 1.62.68h3.04c.64 0 1.2-.28 1.62-.68.42-.42.68-.98.68-1.62v-5.4c0-.64-.26-1.2-.68-1.62-.42-.42-.98-.68-1.62-.68H6.98l.87-.87zm7.5 0L12.1 7.6c-.6.6-.92 1.38-.92 2.2v5.4c0 .64.26 1.2.68 1.62.42.4.98.68 1.62.68h3.04c.64 0 1.2-.28 1.62-.68.42-.42.68-.98.68-1.62v-5.4c0-.64-.26-1.2-.68-1.62-.42-.42-.98-.68-1.62-.68h-1.04l.87-.87z" />
                    </svg>
                    <p 
                      contentEditable
                      suppressContentEditableWarning={true}
                      className="text-lg leading-relaxed text-body-color dark:text-dark-6 lg:text-xl"
                    >
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-center">
                    <div className="mr-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    </div>
                    <div className="text-center lg:text-left">
                      <h4 
                        contentEditable
                        suppressContentEditableWarning={true}
                        className="text-xl font-bold text-dark dark:text-white"
                      >
                        {testimonial.name}
                      </h4>
                      <p 
                        contentEditable
                        suppressContentEditableWarning={true}
                        className="text-body-color dark:text-dark-6"
                      >
                        {testimonial.position}
                      </p>
                      <p 
                        contentEditable
                        suppressContentEditableWarning={true}
                        className="font-medium text-primary"
                      >
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:bg-primary hover:text-white dark:bg-dark-2 dark:hover:bg-primary lg:left-8"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:bg-primary hover:text-white dark:bg-dark-2 dark:hover:bg-primary lg:right-8"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="mt-8 flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-primary" : "bg-gray-300 hover:bg-primary"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials2; 