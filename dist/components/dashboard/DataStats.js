import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../lib/utils';
const DataStatsCard = ({ title, subtitle, value, change, percent, icon, color = '#13C296', className, }) => {
    return (_jsx("div", { className: cn('w-full px-4 sm:w-1/2 lg:w-1/4 xl:w-1/4', className), children: _jsxs("div", { className: "wow fadeInUp mb-8", "data-wow-delay": ".1s", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "mr-4 flex h-[60px] w-[60px] items-center justify-center rounded-md bg-opacity-10", style: { backgroundColor: `${color}20` }, children: icon }), _jsxs("div", { className: "w-full", children: [_jsx("h4", { className: "mb-1 text-2xl font-bold text-dark dark:text-white", children: value }), _jsx("p", { className: "text-base text-body-color dark:text-dark-6", children: title })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [change && (_jsxs("span", { className: cn('mr-2 flex items-center text-sm font-medium', change.type === 'increase' ? 'text-success' : 'text-danger'), children: [change.type === 'increase' ? '↗' : '↘', " ", change.value] })), subtitle && (_jsx("span", { className: "text-sm text-body-color dark:text-dark-6", children: subtitle }))] }), percent && (_jsxs("div", { className: "flex items-center", children: [_jsxs("span", { className: "mr-2 text-sm font-medium text-dark dark:text-white", children: [percent, "%"] }), _jsx("div", { className: "h-2 w-16 rounded-full bg-gray-200 dark:bg-dark-3", children: _jsx("div", { className: "h-2 rounded-full", style: {
                                            width: `${percent}%`,
                                            backgroundColor: color,
                                        } }) })] }))] })] }) }));
};
const DataStats = ({ cards, className }) => {
    return (_jsx("section", { className: cn('bg-gray-2 pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]', className), children: _jsx("div", { className: "mx-auto px-4 md:container", children: _jsx("div", { className: "-mx-4 flex flex-wrap", children: cards.map((card, index) => (_jsx(DataStatsCard, { ...card }, index))) }) }) }));
};
export default DataStats;
//# sourceMappingURL=DataStats.js.map