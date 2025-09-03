import React from "react";

const tableData = [
  {
    name: "Graphics Design",
    startDate: "25 Dec, 2024",
    endDate: "12 Jan, 2025",
  },
  {
    name: "Graphics Design",
    startDate: "25 Dec, 2024",
    endDate: "12 Jan, 2025",
  },
  {
    name: "Graphics Design",
    startDate: "25 Dec, 2024",
    endDate: "12 Jan, 2025",
  },
  {
    name: "Graphics Design",
    startDate: "25 Dec, 2024",
    endDate: "12 Jan, 2025",
  },
  {
    name: "Graphics Design",
    startDate: "25 Dec, 2024",
    endDate: "12 Jan, 2025",
  },
];

const headers = [
  { name: "Project", styles: "min-w-[280px]" },
  { name: "Started", styles: "min-w-[150px]" },
  { name: "Completed", styles: "min-w-[150px]" },
  { name: "", styles: "min-w-[100px]" },
];

const Table4 = () => {
  return (
    <section className="bg-white py-20 dark:bg-dark-2 lg:py-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="max-w-full overflow-x-auto rounded-xl shadow-lg">
              <table className="w-full table-auto">
                <TableHead headers={headers} />
                <TableBody data={tableData} />
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Table4;

const TableHead = ({ headers }) => {
  return (
    <thead>
      <tr className="bg-body-color text-left">
        {headers.map((header, index) => (
          <th
            className={`px-4 py-4 text-base font-medium text-white first:pl-11 last:pr-11 ${header.styles}`}
            key={index}
          >
            {header.name}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableBody = ({ data }) => {
  return (
    <tbody>
      {data.map((row, index) => (
        <tr className="bg-dark" key={index}>
          <td className="border-t border-[#47515A] px-4 py-5 pl-11">
            <h5 className="text-base font-medium text-[#C0C3C6]">{row.name}</h5>
          </td>
          <td className="border-t border-[#47515A] px-4 py-5">
            <p className="text-base font-medium text-[#C0C3C6]">
              {row.startDate}
            </p>
          </td>
          <td className="border-t border-[#47515A] px-4 py-5">
            <p className="text-base font-medium text-[#C0C3C6]">
              {row.endDate}
            </p>
          </td>
          <td className="border-t border-[#47515A] px-4 py-5 pr-11 text-right">
            <button className="text-base font-medium text-[#C0C3C6] hover:text-primary">
              Edit
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};
