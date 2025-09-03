import React, { useState } from "react";

const Tab9 = () => {
  const [open, setOpen] = useState("home");

  const handleTabOpen = (tabCategory) => {
    setOpen(tabCategory);
  };

  return (
    <section className="py-20 lg:py-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="rounded-[10px] bg-white p-6 shadow-card">
              <div className="border-stroke md:border-b">
                <div className="-mx-[6px] flex flex-col md:flex-row">
                  <div className="px-[6px]">
                    <button
                      onClick={() => handleTabOpen("home")}
                      className={`mb-1 w-full rounded border border-stroke bg-gray px-5 py-2 text-base font-medium text-black hover:bg-primary hover:text-white md:mb-0 md:rounded-b-none md:rounded-t md:border-b-0 ${
                        open === "home"
                          ? "border-primary bg-primary text-white"
                          : ""
                      }`}
                    >
                      Home
                    </button>
                  </div>
                  <div className="px-[6px]">
                    <button
                      onClick={() => handleTabOpen("about")}
                      className={`mb-1 w-full rounded border border-stroke bg-gray px-5 py-2 text-base font-medium text-black hover:bg-primary hover:text-white md:mb-0 md:rounded-b-none md:rounded-t md:border-b-0 ${
                        open === "about"
                          ? "border-primary bg-primary text-white"
                          : ""
                      }`}
                    >
                      About Us
                    </button>
                  </div>
                  <div className="px-[6px]">
                    <button
                      onClick={() => handleTabOpen("team")}
                      className={`mb-1 w-full rounded border border-stroke bg-gray px-5 py-2 text-base font-medium text-black hover:bg-primary hover:text-white md:mb-0 md:rounded-b-none md:rounded-t md:border-b-0 ${
                        open === "team"
                          ? "border-primary bg-primary text-white"
                          : ""
                      }`}
                    >
                      Our Team
                    </button>
                  </div>
                  <div className="px-[6px]">
                    <button
                      onClick={() => handleTabOpen("company")}
                      className={`mb-1 w-full rounded border border-stroke bg-gray px-5 py-2 text-base font-medium text-black hover:bg-primary hover:text-white md:mb-0 md:rounded-b-none md:rounded-t md:border-b-0 ${
                        open === "company"
                          ? "border-primary bg-primary text-white"
                          : ""
                      }`}
                    >
                      Company Details
                    </button>
                  </div>
                </div>
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

export default Tab9;

const TabContent = ({ open, tabCategory, details }) => {
  return (
    <div>
      <div
        className={`mt-8 text-base text-body-color ${
          open === tabCategory ? "block" : "hidden"
        } `}
      >
        {details}
      </div>
    </div>
  );
};
