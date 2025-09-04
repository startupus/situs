import React from 'react';

const Preview = () => {
  return (
    <>
      <div className="container">
        <div className="space-x-4 space-y-6">
          <div className="button">Get Started</div>
          <div className="button" data-color="secondary">
            Get Started
          </div>
          <div className="button" data-color="dark">
            Get Started
          </div>

          <div className="button" data-rounded="lg">
            Get Started
          </div>
          <div className="button" data-rounded="lg" data-color="secondary">
            Get Started
          </div>
          <div className="button" data-rounded="lg" data-color="dark">
            Get Started
          </div>

          <div className="button" data-rounded="full">
            Get Started
          </div>
          <div className="button" data-rounded="full" data-color="secondary">
            Get Started
          </div>
          <div className="button" data-rounded="full" data-color="dark">
            Get Started
          </div>

          <div className="button" data-outline="true" data-variant="danger" data-rounded="lg">
            Get Started
          </div>
          <div className="button" data-outline="true" data-variant="info" data-rounded="lg" data-color="secondary">
            Get Started
          </div>
          <div className="button" data-outline="true" data-variant="warning" data-rounded="lg" data-color="dark">
            Get Started
          </div>

          <div className="button" data-outline="true" data-variant="danger" data-rounded="full">
            Get Started
          </div>
          <div className="button" data-outline="true" data-variant="info" data-rounded="full" data-color="secondary">
            Get Started
          </div>
          <div className="button" data-outline="true" data-variant="warning" data-rounded="full" data-color="dark">
            Get Started
          </div>
        </div>
      </div>
    </>
  );
};

export default Preview;
