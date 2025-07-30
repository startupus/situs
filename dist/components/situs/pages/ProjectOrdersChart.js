import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactApexChart from "react-apexcharts";
const ProjectOrdersChart = ({ data }) => {
    const chartData = data.map(item => item.orders);
    const categories = data.map(item => item.projectName);
    const series = [
        {
            name: "Заказы",
            data: chartData,
        },
    ];
    const options = {
        colors: ["#3758F9"],
        chart: {
            fontFamily: "Inter, sans-serif",
            type: "bar",
            height: 350,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                endingShape: "rounded-sm",
                borderRadius: 2,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 4,
            colors: ["transparent"],
        },
        xaxis: {
            categories: categories,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors: "#64748B",
                    fontSize: "12px",
                    fontFamily: "Inter, sans-serif",
                },
            },
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
            fontFamily: "inter",
            markers: {
                radius: 12,
                offsetY: 2,
            },
        },
        yaxis: {
            title: {
                text: "Количество заказов",
                style: {
                    fontSize: "14px",
                    fontFamily: "Inter, sans-serif",
                    color: "#64748B",
                },
            },
            labels: {
                style: {
                    colors: "#64748B",
                    fontSize: "12px",
                    fontFamily: "Inter, sans-serif",
                },
            },
        },
        grid: {
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " заказов";
                },
            },
        },
    };
    return (_jsxs("div", { className: "mx-auto w-full max-w-[760px] rounded-lg border border-stroke bg-white px-5 pb-5 pt-[30px] dark:border-dark-3 dark:bg-dark-2 sm:px-[30px]", children: [_jsxs("div", { className: "flex justify-between", children: [_jsxs("div", { children: [_jsx("h5", { className: "text-xl font-semibold text-dark dark:text-white", children: "\u0417\u0430\u043A\u0430\u0437\u044B \u043F\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0430\u043C" }), _jsx("p", { className: "text-sm text-body-color dark:text-dark-6 sm:text-base", children: "\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043B\u0438\u0434\u043E\u0432 \u0438 \u0437\u0430\u043A\u0430\u0437\u043E\u0432 \u0437\u0430 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u043C\u0435\u0441\u044F\u0446" })] }), _jsx("div", { children: _jsxs("div", { className: "relative z-20 inline-block rounded-md bg-transparent", children: [_jsxs("select", { className: "relative z-20 inline-flex appearance-none rounded-md border border-stroke bg-transparent py-[7px] pl-3 pr-10 text-base text-body-color outline-hidden dark:border-dark-3 dark:text-dark-6", children: [_jsx("option", { value: "", className: "dark:bg-dark-2", children: "\u041C\u0435\u0441\u044F\u0446" }), _jsx("option", { value: "", className: "dark:bg-dark-2", children: "\u041A\u0432\u0430\u0440\u0442\u0430\u043B" })] }), _jsx("span", { className: "absolute right-3 top-1/2 z-10 -translate-y-1/2 text-body-color dark:text-dark-6", children: _jsx("svg", { width: "18", height: "18", viewBox: "0 0 18 18", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "fill-current", children: _jsx("path", { d: "M9 12.8249C8.83125 12.8249 8.69062 12.7687 8.55 12.6562L2.08125 6.2999C1.82812 6.04678 1.82812 5.65303 2.08125 5.3999C2.33437 5.14678 2.72812 5.14678 2.98125 5.3999L9 11.278L15.0187 5.34365C15.2719 5.09053 15.6656 5.09053 15.9187 5.34365C16.1719 5.59678 16.1719 5.99053 15.9187 6.24365L9.45 12.5999C9.30937 12.7405 9.16875 12.8249 9 12.8249Z" }) }) })] }) })] }), _jsx("div", { id: "chartOne", className: "-mx-5", children: _jsx(ReactApexChart, { options: options, series: series, type: "bar", height: 350 }) })] }));
};
export default ProjectOrdersChart;
//# sourceMappingURL=ProjectOrdersChart.js.map