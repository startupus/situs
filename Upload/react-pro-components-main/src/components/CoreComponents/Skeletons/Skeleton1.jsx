import React from "react";

export default function Skeleton1() {
  return (
    <section className="bg-white py-20 dark:bg-dark">
      <div className="container">
        <div className="mx-auto w-full max-w-[570px] space-y-4">
          <div className="bg-linear-to-r h-3 w-full rounded-full from-gray-1 to-gray-4 dark:from-dark-4 dark:to-dark-5"></div>
          <div className="bg-linear-to-r h-3 w-4/6 rounded-full from-gray-1 to-gray-4 dark:from-dark-4 dark:to-dark-5"></div>
          <div className="bg-linear-to-r h-3 w-5/6 rounded-full from-gray-1 to-gray-4 dark:from-dark-4 dark:to-dark-5"></div>
          <div className="bg-linear-to-r h-3 w-full rounded-full from-gray-1 to-gray-4 dark:from-dark-4 dark:to-dark-5"></div>
        </div>
      </div>
    </section>
  );
}
