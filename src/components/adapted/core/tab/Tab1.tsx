/**
 * Tab1 - Tab компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Tab
 * 
 * @component
 * @example
 * <Tab1 
 *   open="value"
 *   tabCategory="value"
 *   details="value"
 * />
 */

import React from 'react';

interface Tab1Props {
  open: string;
  tabCategory: string;
  details: string;
}

const Tab1: React.FC<Tab1Props> = () => {
  const [open, setOpen] = useState("home");

  const handleTabOpen = (tabCategory) => {
    setOpen(tabCategory);
  };

  return (
    <div className="redaktus-component" data-component-type="tab1">
    <>
      <section className="py-20 lg:py-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mb-14 w-full">
                <div className="flex flex-wrap space-x-2 rounded-lg border border-[#E4E4E4] px-4 py-3">
                  <a
                    onClick={() => handleTabOpen("home")}
                    className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium transition-all delay-75 hover:bg-blue-500 hover:text-white md:text-base lg:px-6 ${
                      open === "home" ? "bg-primary text-white" : " "
                    }`}
                  >
                    Home
                  </a>
                  <a
                    onClick={() => handleTabOpen("about")}
                    className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium transition-all delay-75 hover:bg-blue-500 hover:text-white md:text-base lg:px-6 ${
                      open === "about" ? "bg-primary text-white" : " "
                    }`}
                  >
                    About Us
                  </a>
                  <a
                    onClick={() => handleTabOpen("team")}
                    className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium transition-all delay-75 hover:bg-blue-500 hover:text-white md:text-base lg:px-6 ${
                      open === "team" ? "bg-primary text-white" : " "
                    }`}
                  >
                    Our Team
                  </a>
                  <a
                    onClick={() => handleTabOpen("company")}
                    className={`cursor-pointer rounded-md px-4 py-3 text-sm font-medium transition-all delay-75 hover:bg-blue-500 hover:text-white md:text-base lg:px-6 ${
                      open === "company" ? "bg-primary text-white" : " "
                    }`}
                  >
                    Company Details
                  </a>
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
    </>
  )
    </div>;
};

export default Tab1;

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
