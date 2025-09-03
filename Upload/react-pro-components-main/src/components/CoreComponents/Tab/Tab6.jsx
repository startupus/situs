import React, { useState } from "react";

const Tab6 = () => {
  const [open, setOpen] = useState("home");

  const handleTabOpen = (tabCategory) => {
    setOpen(tabCategory);
  };

  return (
    <section className="py-20 lg:py-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mb-14 w-full bg-dark">
              <div className="flex flex-wrap">
                <button
                  onClick={() => handleTabOpen("home")}
                  className={`group flex items-center px-6 py-3 text-sm font-medium text-white hover:bg-primary md:text-base lg:px-12 lg:py-4 ${
                    open === "home" ? "bg-primary" : ""
                  }`}
                >
                  <span
                    className={`mr-2 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#b7b7b7] text-sm group-hover:border-white group-hover:bg-white group-hover:text-body-color ${
                      open === "home"
                        ? "border-white bg-white text-body-color"
                        : ""
                    }`}
                  >
                    01
                  </span>
                  Home
                </button>
                <button
                  onClick={() => handleTabOpen("about")}
                  className={`group flex items-center px-6 py-3 text-sm font-medium text-white hover:bg-primary md:text-base lg:px-12 lg:py-4 ${
                    open === "about" ? "bg-primary" : ""
                  }`}
                >
                  <span
                    className={`mr-2 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#b7b7b7] text-sm group-hover:border-white group-hover:bg-white group-hover:text-body-color ${
                      open === "about"
                        ? "border-white bg-white text-body-color"
                        : ""
                    }`}
                  >
                    02
                  </span>
                  About Us
                </button>
                <button
                  onClick={() => handleTabOpen("team")}
                  className={`group flex items-center px-6 py-3 text-sm font-medium text-white hover:bg-primary md:text-base lg:px-12 lg:py-4 ${
                    open === "team" ? "bg-primary" : ""
                  }`}
                >
                  <span
                    className={`mr-2 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#b7b7b7] text-sm group-hover:border-white group-hover:bg-white group-hover:text-body-color ${
                      open === "team"
                        ? "border-white bg-white text-body-color"
                        : ""
                    }`}
                  >
                    03
                  </span>
                  Our Team
                </button>
                <button
                  onClick={() => handleTabOpen("company")}
                  className={`group flex items-center px-6 py-3 text-sm font-medium text-white hover:bg-primary md:text-base lg:px-12 lg:py-4 ${
                    open === "company" ? "bg-primary" : ""
                  }`}
                >
                  <span
                    className={`mr-2 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#b7b7b7] text-sm group-hover:border-white group-hover:bg-white group-hover:text-body-color ${
                      open === "company"
                        ? "border-white bg-white text-body-color"
                        : ""
                    }`}
                  >
                    04
                  </span>
                  Company Details
                </button>
              </div>
              <TabContent
                details=" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod."
                tabCategory="home"
                open={open}
              />
              <TabContent
                details=" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! "
                tabCategory="about"
                open={open}
              />
              <TabContent
                details="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod.

              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit mollitia nam eligendi reprehenderit reiciendis saepe laboriosam maiores voluptas. Quo, culpa amet fugiat ipsam sed quod hic, veritatis ducimus recusandae repellat quasi eaque, suscipit praesentium totam?"
                tabCategory="team"
                open={open}
              />
              <TabContent
                details="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod."
                tabCategory="company"
                open={open}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tab6;

const TabContent = ({ open, tabCategory, details }) => {
  return (
    <div>
      <div
        className={`p-6 text-base leading-relaxed text-body-color ${
          open === tabCategory ? "block" : "hidden"
        } `}
      >
        {details}
      </div>
    </div>
  );
};
