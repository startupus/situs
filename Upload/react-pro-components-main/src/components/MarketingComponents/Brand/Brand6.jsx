import React from "react";

const Brand6 = () => {
  return (
    <>
      <section className="bg-white py-20 dark:bg-dark lg:py-[120px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-6/12 xl:w-5/12">
              <div className="mb-12 lg:mb-0">
                <h2 className="mb-5 text-3xl font-bold text-dark dark:text-white sm:text-4xl lg:text-[34px] 2xl:text-[38px]">
                  Used by the world's most popular companies
                </h2>
                <p className="mb-10 text-base leading-relaxed text-body-color dark:text-dark-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Pellentesque lobortis lectus ut dui dapibus vestibulum. Aenean
                  efficitur fermentum vestibulum.
                </p>

                <div className="flex flex-wrap">
                  <a
                    href="/#"
                    className="mb-3 mr-3 block rounded-md border border-transparent bg-primary px-7 py-3 text-base font-medium text-white transition hover:bg-primary/90"
                  >
                    Know More
                  </a>
                  <a
                    href="/#"
                    className="mb-3 block rounded-md border border-primary bg-transparent px-7 py-3 text-base font-medium text-primary transition hover:bg-primary hover:text-white"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full px-4 lg:w-6/12 xl:w-7/12">
              <div className="flex flex-wrap items-center justify-center">
                <SingleImage
                  href="#"
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/graygrids.svg"
                />
                <SingleImage
                  href="#"
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/lineicons.svg"
                />
                <SingleImage
                  href="#"
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/uideck.svg"
                />
                <SingleImage
                  href="#"
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/ayroui.svg"
                />
                <SingleImage
                  href="#"
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/plainadmin.svg"
                />
                <SingleImage
                  href="#"
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/ecom.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Brand6;

const SingleImage = ({ href, imgSrc, Alt }) => {
  return (
    <>
      <a
        href={href}
        className="flex h-[110px] max-w-[188px] items-center justify-center border border-stroke px-7 hover:bg-primary/10 dark:border-primary/10 dark:hover:bg-primary/5"
      >
        <img src={imgSrc} alt={Alt} className="h-10 w-full" />
      </a>
    </>
  );
};
