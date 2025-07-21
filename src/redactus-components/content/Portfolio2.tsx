import React from 'react';

export interface Portfolio2Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  portfolioItems?: MasonryPortfolioItem[];
}

export interface MasonryPortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  size: 'small' | 'medium' | 'large';
  link?: string;
}

const Portfolio2: React.FC<Portfolio2Props> = ({
  sectionTitle = "Creative Portfolio",
  sectionSubtitle = "Discover our latest work and creative projects that showcase our expertise and innovation.",
  portfolioItems = [
    {
      id: 1,
      title: "Brand Identity Design",
      category: "Branding",
      image: "/images/portfolio/portfolio-01.jpg",
      size: "large"
    },
    {
      id: 2,
      title: "Web Application",
      category: "Development",
      image: "/images/portfolio/portfolio-02.jpg",
      size: "medium"
    },
    {
      id: 3,
      title: "Mobile Interface",
      category: "UI/UX",
      image: "/images/portfolio/portfolio-03.jpg",
      size: "small"
    },
    {
      id: 4,
      title: "E-commerce Platform",
      category: "Development",
      image: "/images/portfolio/portfolio-04.jpg",
      size: "medium"
    },
    {
      id: 5,
      title: "Marketing Campaign",
      category: "Marketing",
      image: "/images/portfolio/portfolio-05.jpg",
      size: "small"
    },
    {
      id: 6,
      title: "Corporate Website",
      category: "Web Design",
      image: "/images/portfolio/portfolio-06.jpg",
      size: "large"
    }
  ]
}) => {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'lg:col-span-2 lg:row-span-2 h-[400px] lg:h-[520px]';
      case 'medium':
        return 'lg:col-span-1 lg:row-span-2 h-[400px]';
      case 'small':
        return 'lg:col-span-1 lg:row-span-1 h-[250px]';
      default:
        return 'lg:col-span-1 lg:row-span-1 h-[250px]';
    }
  };

  return (
    <section id="portfolio" className="bg-white py-16 dark:bg-dark lg:py-[120px]">
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
                  Portfolio
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

        <div className="px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-dark-2 ${getSizeClasses(item.size)}`}
              >
                <div className="relative h-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                      <span className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                        <span contentEditable suppressContentEditableWarning={true}>
                          {item.category}
                        </span>
                      </span>
                      <h3 
                        contentEditable
                        suppressContentEditableWarning={true}
                        className="mb-2 text-xl font-bold lg:text-2xl"
                      >
                        {item.title}
                      </h3>
                      <a
                        href={item.link || "#"}
                        className="inline-flex items-center text-sm font-medium hover:text-primary"
                      >
                        <span contentEditable suppressContentEditableWarning={true}>
                          View Project
                        </span>
                        <svg
                          className="ml-1 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
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

                  {/* View Button */}
                  <div className="absolute right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <a
                      href={item.link || "#"}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors duration-300 hover:bg-primary"
                    >
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio2; 