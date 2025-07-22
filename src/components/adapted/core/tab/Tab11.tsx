/**
 * Tab11 - Tab компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: CoreComponents
 * Подкатегория: Tab
 * 
 * @component
 * @example
 * <Tab11 
 *   open="value"
 *   tabCategory="value"
 *   details="value"
 * />
 */

import React from 'react';

interface Tab11Props {
  open: string;
  tabCategory: string;
  details: string;
}

const Tab11: React.FC<Tab11Props> = () => {
  const [open, setOpen] = useState("home");

  const handleTabOpen = (tabCategory) => {
    setOpen(tabCategory);
  };

  return (
    <div className="redaktus-component" data-component-type="tab11">
    <section className="py-20 lg:py-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="rounded-[10px] bg-white p-6 shadow-card">
              <div className="-mx-[6px] flex flex-col sm:flex-row">
                <div className="px-[6px]">
                  <button
                    onClick={() => handleTabOpen("home")}
                    className={`-mb-[1px] w-full border-b-2 px-5 py-2 text-base font-medium text-black hover:border-primary hover:bg-gray hover:text-primary ${
                      open === "home"
                        ? "border-primary bg-gray text-primary"
                        : "border-transparent"
                    }`}
                  >
                    Home
                  </button>
                </div>
                <div className="px-[6px]">
                  <button
                    onClick={() => handleTabOpen("about")}
                    className={`-mb-[1px] w-full border-b-2 px-5 py-2 text-base font-medium text-black hover:border-primary hover:bg-gray hover:text-primary ${
                      open === "about"
                        ? "border-primary bg-gray text-primary"
                        : "border-transparent"
                    }`}
                  >
                    About Us
                  </button>
                </div>
                <div className="px-[6px]">
                  <button
                    onClick={() => handleTabOpen("team")}
                    className={`-mb-[1px] w-full border-b-2 px-5 py-2 text-base font-medium text-black hover:border-primary hover:bg-gray hover:text-primary ${
                      open === "team"
                        ? "border-primary bg-gray text-primary"
                        : "border-transparent"
                    }`}
                  >
                    Our Team
                  </button>
                </div>
                <div className="px-[6px]">
                  <button
                    onClick={() => handleTabOpen("company")}
                    className={`-mb-[1px] w-full border-b-2 px-5 py-2 text-base font-medium text-black hover:border-primary hover:bg-gray hover:text-primary ${
                      open === "company"
                        ? "border-primary bg-gray text-primary"
                        : "border-transparent"
                    }`}
                  >
                    Company Details
                  </button>
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
  )
    </div>;
};

export default Tab11;

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
