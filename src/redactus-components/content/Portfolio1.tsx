import React from 'react';

export interface Portfolio1Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  portfolioItems?: PortfolioItem[];
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  link?: string;
}

const Portfolio1: React.FC<Portfolio1Props> = ({
  sectionTitle = "Our Portfolio",
  sectionSubtitle = "Check out some of our awesome projects with creative ideas and great design.",
  portfolioItems = [
    {
      id: 1,
      title: "Creative Design",
      category: "UI/UX Design",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
      image: "/images/portfolio/portfolio-01.jpg"
    },
    {
      id: 2,
      title: "Web Development",
      category: "Development",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
      image: "/images/portfolio/portfolio-02.jpg"
    },
    {
      id: 3,
      title: "Mobile App",
      category: "App Development",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
      image: "/images/portfolio/portfolio-03.jpg"
    },
    {
      id: 4,
      title: "Brand Identity",
      category: "Branding",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
      image: "/images/portfolio/portfolio-04.jpg"
    },
    {
      id: 5,
      title: "Digital Marketing",
      category: "Marketing",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
      image: "/images/portfolio/portfolio-05.jpg"
    },
    {
      id: 6,
      title: "E-commerce",
      category: "Web Development",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
      image: "/images/portfolio/portfolio-06.jpg"
    }
  ]
}) => {
  return (
    <section id="portfolio" className="bg-slate-100 py-16 dark:bg-slate-900 lg:py-[120px]">
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
                  Our Portfolio
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
          {portfolioItems.map((item) => (
            <div key={item.id} className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="mx-auto mb-8 max-w-[370px] rounded-lg overflow-hidden shadow-lg bg-white dark:bg-dark-2">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[250px] object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 
                    contentEditable
                    suppressContentEditableWarning={true}
                    className="mb-3 text-xl font-bold text-dark dark:text-white hover:text-primary"
                  >
                    {item.title}
                  </h3>
                  <p 
                    contentEditable
                    suppressContentEditableWarning={true}
                    className="text-base text-body-color dark:text-dark-6"
                  >
                    {item.description}
                  </p>
                  <div className="mt-4">
                    <a
                      href={item.link || "#"}
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      <span contentEditable suppressContentEditableWarning={true}>
                        View Details
                      </span>
                      <svg
                        className="ml-1 h-4 w-4"
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
                    </a>
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

export default Portfolio1; 