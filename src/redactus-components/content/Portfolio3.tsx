import React, { useState } from 'react';

export interface Portfolio3Props {
  sectionTitle?: string;
  sectionSubtitle?: string;
  portfolioItems?: FilterablePortfolioItem[];
  categories?: string[];
}

export interface FilterablePortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  link?: string;
  tags?: string[];
}

const Portfolio3: React.FC<Portfolio3Props> = ({
  sectionTitle = "Our Work",
  sectionSubtitle = "We create amazing digital experiences. Take a look at our recent projects and see what we can do for you.",
  portfolioItems = [
    {
      id: 1,
      title: "Corporate Website",
      category: "Web Development",
      description: "Modern responsive website with advanced functionality",
      image: "/images/portfolio/portfolio-01.jpg",
      tags: ["React", "Tailwind", "API"]
    },
    {
      id: 2,
      title: "Mobile App Design",
      category: "UI/UX Design",
      description: "Intuitive mobile application with modern interface",
      image: "/images/portfolio/portfolio-02.jpg",
      tags: ["Figma", "Mobile", "UX"]
    },
    {
      id: 3,
      title: "Brand Identity",
      category: "Branding",
      description: "Complete branding solution with logo and guidelines",
      image: "/images/portfolio/portfolio-03.jpg",
      tags: ["Logo", "Colors", "Typography"]
    },
    {
      id: 4,
      title: "E-commerce Platform",
      category: "Web Development", 
      description: "Full-featured online store with payment integration",
      image: "/images/portfolio/portfolio-04.jpg",
      tags: ["E-commerce", "Payment", "Admin"]
    },
    {
      id: 5,
      title: "Marketing Campaign",
      category: "Marketing",
      description: "Digital marketing campaign with impressive results",
      image: "/images/portfolio/portfolio-05.jpg",
      tags: ["Social Media", "Analytics", "ROI"]
    },
    {
      id: 6,
      title: "Dashboard Design",
      category: "UI/UX Design",
      description: "Clean and functional dashboard interface",
      image: "/images/portfolio/portfolio-06.jpg",
      tags: ["Dashboard", "Data Viz", "Admin"]
    }
  ],
  categories = ["All", "Web Development", "UI/UX Design", "Branding", "Marketing"]
}) => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredItems = activeFilter === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="bg-gray-50 py-16 dark:bg-dark-2 lg:py-[120px]">
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

        {/* Filter Buttons */}
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-dark hover:bg-primary hover:text-white dark:bg-dark dark:text-white dark:hover:bg-primary"
              }`}
            >
              <span contentEditable suppressContentEditableWarning={true}>
                {category}
              </span>
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="-mx-4 flex flex-wrap">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="w-full px-4 md:w-1/2 lg:w-1/3"
            >
              <div className="group mb-8 overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-dark">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[250px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="text-center text-white">
                      <h4 className="mb-2 text-xl font-bold">View Project</h4>
                      <p className="text-sm">Click to see details</p>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-dark backdrop-blur-sm">
                      <span contentEditable suppressContentEditableWarning={true}>
                        {item.category}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 
                    contentEditable
                    suppressContentEditableWarning={true}
                    className="mb-3 text-xl font-bold text-dark dark:text-white"
                  >
                    {item.title}
                  </h3>
                  <p 
                    contentEditable
                    suppressContentEditableWarning={true}
                    className="mb-4 text-body-color dark:text-dark-6"
                  >
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.tags && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-dark-3 dark:text-gray-300"
                        >
                          <span contentEditable suppressContentEditableWarning={true}>
                            {tag}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}

                  <a
                    href={item.link || "#"}
                    className="inline-flex items-center font-medium text-primary hover:underline"
                  >
                    <span contentEditable suppressContentEditableWarning={true}>
                      View Details
                    </span>
                    <svg
                      className="ml-1 h-4 w-4 transition-transform duration-300 hover:translate-x-1"
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
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center">
            <p className="text-lg text-body-color dark:text-dark-6">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio3; 