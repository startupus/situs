import React from "react";
import FormElement from "./index";

const Preview = () => {
  return (
    <>
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <FormElement
              input
              placeholder="Default Input"
              level="Default Input"
            />
            <FormElement
              input
              placeholder="Default Input"
              active
              level="Default Input"
            />
            <FormElement
              input
              placeholder="Default Input"
              disabled
              level="Default Input"
            />
            <FormElement
              textArea
              rows="5"
              defaultValue=""
              placeholder="Default Input"
              level="Default Input"
            />
            <FormElement
              textArea
              rows="5"
              active
              defaultValue=""
              placeholder="Default Input"
              level="Default Input"
            />
            <FormElement
              textArea
              defaultValue=""
              placeholder="Default Input"
              disabled
              level="Default Input"
            />
            <FormElement
              fileInput
              defaultValue=""
              placeholder="Default Input"
              disabled
              level="Default Input"
            />
            <FormElement
              select
              defaultValue=""
              placeholder="Default Input"
              disabled
              level="Default Input"
            >
              <option value="">Option 1</option>
              <option value="">Option 2</option>
              <option value="">Option 3</option>
            </FormElement>
          </div>
        </div>
      </section>
    </>
  );
};

export default Preview;
