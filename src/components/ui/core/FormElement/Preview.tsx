import React from 'react';
// import FormElement from './index'; // Temporarily data-disabled="true"

const Preview = () => {
  return (
    <>
      <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20">
        <div className="container">
          <div className="flex flex-wrap -mx-4">
            <div
              className="form-element"
              data-type="input"
              data-placeholder="Default Input"
              data-level="Default Input"
            />
            <div
              className="form-element"
              data-type="input"
              data-placeholder="Default Input"
              data-active="true"
              data-level="Default Input"
            />
            <div
              className="form-element"
              data-type="input"
              data-placeholder="Default Input"
              data-disabled="true"
              data-level="Default Input"
            />
            <div
              className="form-element"
              data-type="textarea"
              data-rows="5"
              data-default=""
              data-placeholder="Default Input"
              data-level="Default Input"
            />
            <div
              className="form-element"
              data-type="textarea"
              data-rows="5"
              data-active="true"
              data-default=""
              data-placeholder="Default Input"
              data-level="Default Input"
            />
            <div
              className="form-element"
              data-type="textarea"
              data-default=""
              data-placeholder="Default Input"
              data-disabled="true"
              data-level="Default Input"
            />
            <div
              className="form-element"
              data-type="file"
              data-default=""
              data-placeholder="Default Input"
              data-disabled="true"
              data-level="Default Input"
            />
            <div
              className="form-element"
              data-type="select"
              data-default=""
              data-placeholder="Default Input"
              data-disabled="true"
              data-level="Default Input"
            >
              <option value="">Option 1</option>
              <option value="">Option 2</option>
              <option value="">Option 3</option>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Preview;
