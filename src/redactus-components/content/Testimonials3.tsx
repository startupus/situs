import React from 'react';

export interface Testimonials3Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  testimonials?: VideoTestimonialItem[];
}

export interface VideoTestimonialItem {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
  videoThumbnail?: string;
  location: string;
}

const Testimonials3: React.FC<Testimonials3Props> = ({
  sectionTitle = "Real Stories, Real Results",
  sectionSubtitle = "Hear directly from our clients about their experience working with us and the results they achieved.",
  testimonials = [
    {
      id: 1,
      name: "Alex Morgan",
      position: "Founder",
      company: "HealthTech Solutions",
      content: "The team exceeded all expectations. Our app downloads increased by 300% within the first month of launch.",
      avatar: "/images/testimonials/testimonial-01.jpg",
      rating: 5,
      location: "San Francisco, CA"
    },
    {
      id: 2,
      name: "Sophie Chen",
      position: "Head of Digital",
      company: "Fashion Forward",
      content: "Their strategic approach to our e-commerce platform helped us achieve a 250% increase in online sales.",
      avatar: "/images/testimonials/testimonial-02.jpg",
      rating: 5,
      location: "New York, NY"
    },
    {
      id: 3,
      name: "Marcus Johnson",
      position: "Operations Director",
      company: "LogiFlow Systems",
      content: "The automation solution they built saved us 40 hours per week and reduced errors by 95%.",
      avatar: "/images/testimonials/testimonial-03.jpg",
      rating: 5,
      location: "Austin, TX"
    },
    {
      id: 4,
      name: "Isabella Rodriguez",
      position: "Marketing Lead",
      company: "GreenEnergy Co",
      content: "Our brand visibility improved dramatically. The campaign generated 500% more leads than expected.",
      avatar: "/images/testimonials/testimonial-01.jpg",
      rating: 5,
      location: "Miami, FL"
    },
    {
      id: 5,
      name: "Robert Kim",
      position: "Tech Lead",
      company: "DataVault Inc",
      content: "The API integration was seamless and the documentation was perfect. Deployment was faster than ever.",
      avatar: "/images/testimonials/testimonial-02.jpg",
      rating: 5,
      location: "Seattle, WA"
    },
    {
      id: 6,
      name: "Emma Williams",
      position: "Product Manager",
      company: "EduLearn Platform",
      content: "User engagement on our platform increased by 180% thanks to the UX improvements they implemented.",
      avatar: "/images/testimonials/testimonial-03.jpg",
      rating: 5,
      location: "Boston, MA"
    }
  ]
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`h-4 w-4 ${
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
    <section id="testimonials" className="bg-gray-50 py-16 dark:bg-dark lg:py-[120px]">
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
            <div key={testimonial.id} className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="group mb-8 overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-dark-2">
                {/* Header */}
                <div className="border-b border-gray-100 p-6 dark:border-dark-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <h4 
                          contentEditable
                          suppressContentEditableWarning={true}
                          className="font-semibold text-dark dark:text-white"
                        >
                          {testimonial.name}
                        </h4>
                        <p 
                          contentEditable
                          suppressContentEditableWarning={true}
                          className="text-sm text-body-color dark:text-dark-6"
                        >
                          {testimonial.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p 
                    contentEditable
                    suppressContentEditableWarning={true}
                    className="mb-4 text-base leading-relaxed text-body-color dark:text-dark-6"
                  >
                    "{testimonial.content}"
                  </p>

                  {/* Company and Location */}
                  <div className="flex items-center justify-between text-sm">
                    <span 
                      contentEditable
                      suppressContentEditableWarning={true}
                      className="font-medium text-primary"
                    >
                      {testimonial.company}
                    </span>
                    <span 
                      contentEditable
                      suppressContentEditableWarning={true}
                      className="text-body-color dark:text-dark-6"
                    >
                      {testimonial.location}
                    </span>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="h-1 bg-gradient-to-r from-primary to-primary/60"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 rounded-lg bg-white p-8 shadow-lg dark:bg-dark-2">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/4">
              <div className="text-center">
                <h3 
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="mb-2 text-3xl font-bold text-primary lg:text-4xl"
                >
                  500+
                </h3>
                <p 
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="text-body-color dark:text-dark-6"
                >
                  Happy Clients
                </p>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/4">
              <div className="text-center">
                <h3 
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="mb-2 text-3xl font-bold text-primary lg:text-4xl"
                >
                  98%
                </h3>
                <p 
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="text-body-color dark:text-dark-6"
                >
                  Success Rate
                </p>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/4">
              <div className="text-center">
                <h3 
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="mb-2 text-3xl font-bold text-primary lg:text-4xl"
                >
                  5.0
                </h3>
                <p 
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="text-body-color dark:text-dark-6"
                >
                  Average Rating
                </p>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/4">
              <div className="text-center">
                <h3 
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="mb-2 text-3xl font-bold text-primary lg:text-4xl"
                >
                  150+
                </h3>
                <p 
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="text-body-color dark:text-dark-6"
                >
                  Projects Completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials3; 