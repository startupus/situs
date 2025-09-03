import imageOne from "../../assets/ecom-images/products-details/details-03/big-image-01.jpg";
import imageTwo from "../../assets/ecom-images/products-details/details-03/big-image-02.jpg";
import imageThree from "../../assets/ecom-images/products-details/details-03/big-image-03.jpg";
import thumbOne from "../../assets/ecom-images/products-details/details-03/thumbnail-01.jpg";
import thumbTwo from "../../assets/ecom-images/products-details/details-03/thumbnail-02.jpg";
import thumbThree from "../../assets/ecom-images/products-details/details-03/thumbnail-03.jpg";
import { useState } from "react";
import ClickOutside from "../ClickOutside.jsx";

const productTabItems = [
  {
    image: imageOne,
    thumbnail: thumbOne,
  },
  {
    image: imageTwo,
    thumbnail: thumbTwo,
  },
  {
    image: imageThree,
    thumbnail: thumbThree,
  },
];

const ProductTab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTab = (index) => {
    setActiveTab(index);
  };

  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <div className="w-full px-4 md:w-9/12 lg:w-5/12">
        <div className="relative mb-8 border border-stroke dark:border-dark-3">
          {productTabItems.map(
            (product, productIndex) =>
              activeTab === productIndex && (
                <div key={productIndex}>
                  <button
                    onClick={handleModalOpen}
                    className="absolute right-6 top-6 text-base font-medium text-dark"
                  >
                    Click to Zoom
                  </button>
                  <img src={product.image} alt="product" className="w-full" />
                </div>
              ),
          )}
        </div>
      </div>

      <div className="mb-12 w-full px-4 md:order-first md:mb-0 md:w-3/12 lg:w-2/12">
        <div className="-mx-2 flex flex-wrap items-center justify-between">
          {productTabItems.map((tab, tabIndex) => (
            <div key={tabIndex} className="w-1/4 px-2 md:w-full">
              <button
                onClick={() => handleTab(tabIndex)}
                className={`w-full overflow-hidden border-2 md:mb-7 ${activeTab === tabIndex ? "border-primary" : "border-transparent"}`}
              >
                <img
                  src={tab.thumbnail}
                  alt="thumbnail-01"
                  className="w-full"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {productTabItems.map(
        (product, productIndex) =>
          activeTab === productIndex && (
            <div key={productIndex}>
              {modalOpen && (
                <div className="fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black/50 py-10">
                  <div className="mx-auto inline-block w-4/5 sm:w-3/4 lg:w-1/2">
                    <ClickOutside onClick={() => setModalOpen(false)}>
                      <img
                        src={product.image}
                        alt="product"
                        className="w-full"
                      />
                    </ClickOutside>
                  </div>
                </div>
              )}
            </div>
          ),
      )}
    </>
  );
};

export default ProductTab;
