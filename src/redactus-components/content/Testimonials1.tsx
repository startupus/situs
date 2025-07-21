import React from 'react';

export interface Testimonials1Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  testimonials?: TestimonialItem[];
}

export interface TestimonialItem {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar: string;
  rating?: number;
}

const Testimonials1: React.FC<Testimonials1Props> = ({
  sectionTitle = "What Our Clients Say",
  sectionSubtitle = "Don't take our word for it. Here's what our clients have to say about working with us.",
  testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Marketing Director",
      company: "TechCorp Inc.",
      content: "Working with this team has been an absolute pleasure. They delivered exceptional results that exceeded our expectations and helped us achieve our business goals.",
      avatar: "/images/testimonials/testimonial-01.jpg",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "CEO",
      company: "StartupXYZ",
      content: "Their expertise and professionalism are unmatched. The project was completed on time and within budget, with outstanding quality throughout.",
      avatar: "/images/testimonials/testimonial-02.jpg",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "Product Manager",
      company: "InnovateLab",
      content: "I highly recommend their services. They understood our vision perfectly and brought it to life with incredible attention to detail and creativity.",
      avatar: "/images/testimonials/testimonial-03.jpg",
      rating: 5
    }
  ]
}) => {
  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`h-5 w-5 ${
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
    <section id="testimonials" className="bg-white py-16 dark:bg-dark lg:py-[120px]">
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

        <div className="-mx-4 flex flex-wrap">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full px-4 lg:w-1/3">
              <div className="mx-auto mb-8 max-w-[370px] rounded-lg bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-dark-2">
                {/* Quote Icon */}
                <div className="mb-6">
                  <svg
                    className="h-10 w-10 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.85 6.34L4.6 7.6c-.6.6-.92 1.38-.92 2.2v5.4c0 .64.26 1.2.68 1.62.42.4.98.68 1.62.68h3.04c.64 0 1.2-.28 1.62-.68.42-.42.68-.98.68-1.62v-5.4c0-.64-.26-1.2-.68-1.62-.42-.42-.98-.68-1.62-.68H6.98l.87-.87zm7.5 0L12.1 7.6c-.6.6-.92 1.38-.92 2.2v5.4c0 .64.26 1.2.68 1.62.42.4.98.68 1.62.68h3.04c.64 0 1.2-.28 1.62-.68.42-.42.68-.98.68-1.62v-5.4c0-.64-.26-1.2-.68-1.62-.42-.42-.98-.68-1.62-.68h-1.04l.87-.87z" />
                  </svg>
                </div>

                {/* Rating */}
                <div className="mb-4 flex items-center">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Content */}
                <p 
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="mb-6 text-base leading-relaxed text-body-color dark:text-dark-6"
                >
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="mr-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 
                      contentEditable
                      suppressContentEditableWarning={true}
                      className="text-lg font-semibold text-dark dark:text-white"
                    >
                      {testimonial.name}
                    </h4>
                    <p 
                      contentEditable
                      suppressContentEditableWarning={true}
                      className="text-sm text-body-color dark:text-dark-6"
                    >
                      {testimonial.position} at{" "}
                      <span 
                        contentEditable
                        suppressContentEditableWarning={true}
                        className="font-medium text-primary"
                      >
                        {testimonial.company}
                      </span>
                    </p>
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

export default Testimonials1; 