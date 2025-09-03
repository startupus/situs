import React from "react";

const Portfolio5 = () => {
  return (
    <section className="pb-5 pt-20 dark:bg-dark lg:pb-[60px] lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-1/2">
            <div className="mb-[60px] max-w-[510px]">
              <span className="mb-2 block text-lg font-semibold text-primary">
                Portfolio
              </span>
              <h2 className="mb-3 text-3xl font-bold leading-[1.208] text-dark dark:text-white sm:text-4xl md:text-[40px]">
                Check out some of our recent projects below.
              </h2>
              <p className="text-base text-body-color dark:text-dark-6">
                There are many variations of passages of Lorem Ipsum available
                but the majority have suffered alteration in some form.
              </p>
            </div>

            <PortfolioCard
              img="https://cdn.tailgrids.com/2.0/image/marketing/images/portfolio/portfolio-05/image-01.jpg"
              subtitle="INVITATION"
              title="Mollis Ipsum Mattis"
              link="/#"
            />
            <PortfolioCard
              img="https://cdn.tailgrids.com/2.0/image/marketing/images/portfolio/portfolio-05/image-02.jpg"
              subtitle="STATIONARY"
              title="Ipsum Ultricies Cursus"
              link="/#"
            />
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <PortfolioCard
              img="https://cdn.tailgrids.com/2.0/image/marketing/images/portfolio/portfolio-05/image-03.jpg"
              subtitle="INVITATION"
              title="Mollis Ipsum Mattis"
              link="/#"
            />
            <PortfolioCard
              img="https://cdn.tailgrids.com/2.0/image/marketing/images/portfolio/portfolio-05/image-04.jpg"
              subtitle="PRODUCT"
              title="Inceptos Euismod Egestas"
              link="/#"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio5;

const PortfolioCard = ({ img, subtitle, link, title }) => {
  return (
    <div className="mb-[60px] mr-0 lg:mr-4">
      <div className="mb-9 overflow-hidden rounded-xl">
        <img src={img} alt="image" className="w-full" />
      </div>
      <div className="content">
        <div className="mb-4 flex items-center">
          <span className="mr-3 inline-block h-px w-6 bg-primary"></span>
          <span className="text-sm font-semibold uppercase text-primary">
            {subtitle}
          </span>
        </div>
        <h3>
          <a
            href={link}
            className="inline-block text-xl font-bold text-dark hover:text-primary dark:text-white sm:text-2xl"
          >
            {title}
          </a>
        </h3>
      </div>
    </div>
  );
};
