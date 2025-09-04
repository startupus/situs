import imageOne from "../assets/images/testimonials/testimonial-04/image-01.png";
import imageTwo from "../assets/images/testimonials/testimonial-04/image-02.png";
import imageThree from "../assets/images/testimonials/testimonial-04/image-03.png";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef } from "react";

const testimonialItems = [
  {
    image: imageOne,
    name: "Sabo Masties",
    position: "Founder @ Rolex",
    details: `Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.`,
  },
  {
    image: imageTwo,
    name: "Musharof Chowdhury",
    position: "Founder @ Ayro UI",
    details: `Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.`,
  },
  {
    image: imageThree,
    name: "William Smith",
    position: "Founder @ Trorex",
    details: `Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.`,
  },
  {
    image: imageOne,
    name: "Sabo Masties",
    position: "Founder @ Rolex",
    details: `Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.`,
  },
  {
    image: imageTwo,
    name: "Musharof Chowdhury",
    position: "Founder @ Ayro UI",
    details: `Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.`,
  },
  {
    image: imageThree,
    name: "William Smith",
    position: "Founder @ Trorex",
    details: `Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.`,
  },
];

const Testimonial = () => {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <>
      <section className="bg-tg-bg pb-10 pt-20 dark:bg-dark-2 lg:pb-20 lg:pt-[120px]">
        <div className="container relative mx-auto overflow-hidden">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div className="mx-auto mb-[60px] max-w-[510px] text-center">
                <span className="mb-2 block text-lg font-semibold text-primary">
                  Testimonials
                </span>
                <h2 className="mb-3 text-3xl font-bold leading-[1.2] text-dark dark:text-white sm:text-4xl md:text-[40px]">
                  What our Clients Says
                </h2>
                <p className="text-base text-body-color dark:text-dark-6">
                  There are many variations of passages of Lorem Ipsum available
                  but the majority have suffered alteration in some form.
                </p>
              </div>
            </div>
          </div>

          <Swiper
            breakpoints={{
              640: {
                width: 640,
                slidesPerView: 1,
              },
              768: {
                width: 768,
                slidesPerView: 2.2,
              },
              1024: {
                width: 1024,
                slidesPerView: 2.2,
              },
              1280: {
                width: 1280,
                slidesPerView: 3,
              },
            }}
            loop={true}
            spaceBetween={30}
            ref={sliderRef}
            className="overflow-visible!"
          >
            {testimonialItems.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="relative flex justify-center">
                  <div className="relative w-full pb-16">
                    <div className="shadow-testimonial-5 dark:shadow-box-dark mb-10 bg-white p-8 dark:bg-dark lg:px-6 lg:py-8 xl:p-8">
                      <div className="mb-5 flex items-center">
                        {[...Array(5).keys()].map((index) => (
                          <span className="mr-1" key={index}>
                            <svg
                              width="18"
                              height="16"
                              viewBox="0 0 18 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.09815 0.360596L11.1054 6.06493H17.601L12.3459 9.5904L14.3532 15.2947L9.09815 11.7693L3.84309 15.2947L5.85035 9.5904L0.595291 6.06493H7.0909L9.09815 0.360596Z"
                                fill="#FBB040"
                              />
                            </svg>
                          </span>
                        ))}
                      </div>
                      <p className="mb-6 text-base text-body-color dark:text-dark-6">
                        {item.details}
                      </p>
                      <div className="flex items-center">
                        <div className="mr-4 h-[50px] w-full max-w-[50px]">
                          <img
                            src={item.image}
                            alt="image"
                            className="w-full"
                          />
                        </div>
                        <div className="w-full">
                          <h5 className="mb-0.5 text-sm font-semibold text-dark dark:text-white">
                            {item.name}
                          </h5>
                          <p className="text-secondary-color text-xs dark:text-dark-6">
                            {item.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-3">
              <div className="prev-arrow cursor-pointer" onClick={handlePrev}>
                <button className="shadow-btn-3 flex h-12 w-12 items-center justify-center bg-white text-dark transition-all hover:bg-primary hover:text-white dark:bg-dark dark:text-white dark:shadow-none dark:hover:bg-primary">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current"
                  >
                    <path
                      d="M19.25 10.2437H4.57187L10.4156 4.29687C10.725 3.9875 10.725 3.50625 10.4156 3.19687C10.1062 2.8875 9.625 2.8875 9.31562 3.19687L2.2 10.4156C1.89062 10.725 1.89062 11.2063 2.2 11.5156L9.31562 18.7344C9.45312 18.8719 9.65937 18.975 9.86562 18.975C10.0719 18.975 10.2437 18.9062 10.4156 18.7687C10.725 18.4594 10.725 17.9781 10.4156 17.6688L4.60625 11.7906H19.25C19.6625 11.7906 20.0063 11.4469 20.0063 11.0344C20.0063 10.5875 19.6625 10.2437 19.25 10.2437Z"
                      fill=""
                    />
                  </svg>
                </button>
              </div>
              <div className="next-arrow cursor-pointer" onClick={handleNext}>
                <button className="shadow-btn-3 flex h-12 w-12 items-center justify-center bg-white text-dark transition-all hover:bg-primary hover:text-white dark:bg-dark dark:text-white dark:shadow-none dark:hover:bg-primary">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current"
                  >
                    <path
                      d="M19.8 10.45L12.6844 3.23124C12.375 2.92186 11.8938 2.92186 11.5844 3.23124C11.275 3.54061 11.275 4.02186 11.5844 4.33124L17.3594 10.2094H2.75C2.3375 10.2094 1.99375 10.5531 1.99375 10.9656C1.99375 11.3781 2.3375 11.7562 2.75 11.7562H17.4281L11.5844 17.7031C11.275 18.0125 11.275 18.4937 11.5844 18.8031C11.7219 18.9406 11.9281 19.0094 12.1344 19.0094C12.3406 19.0094 12.5469 18.9406 12.6844 18.7687L19.8 11.55C20.1094 11.2406 20.1094 10.7594 19.8 10.45Z"
                      fill=""
                    />
                  </svg>
                </button>
              </div>
            </div>
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default Testimonial;
