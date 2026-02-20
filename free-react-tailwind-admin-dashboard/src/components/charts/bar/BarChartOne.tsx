import React from "react";

const LineChart: React.FC = () => {
  return (
    <>
      {/* Inline Breadcrumb - Guaranteed to work without imports! */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Line Chart
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <span className="font-medium">Dashboard /</span>
            </li>
            <li className="font-medium text-primary">Line Chart</li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="mb-3 justify-between gap-4 sm:flex">
            <div>
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Revenue Analytics
              </h4>
            </div>
          </div>
          
          <div className="flex h-[350px] items-center justify-center rounded-md bg-gray-50 dark:bg-meta-4">
            <span className="font-medium text-gray-500 dark:text-gray-400">
              [ Line Chart Canvas ]
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LineChart;