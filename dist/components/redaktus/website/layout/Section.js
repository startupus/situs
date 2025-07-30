import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import { bgColors } from '../colors';
const HR = ({ boxed = false }) => {
    if (boxed) {
        return (_jsx("div", { className: "sm:w-11/12 xl:w-9/12 mx-auto px-6 md:px-12", children: _jsx("hr", { className: "border-gray-900 border-opacity-10 dark:border-gray-700" }) }));
    }
    return (_jsx("hr", { className: "border-gray-900 border-opacity-10 dark:border-gray-700" }));
};
const Section = ({ bg = bgColors.white.value, borderTop = 'none', borderBottom = 'none', className = '', children, }) => {
    const bgColor = bg.className;
    return (_jsxs("section", { className: classNames(bgColor, className, 'overflow-hidden'), children: [borderTop !== 'none' && _jsx(HR, { boxed: borderTop === 'boxed' }), children, borderBottom !== 'none' && _jsx(HR, { boxed: borderBottom === 'boxed' })] }));
};
export default Section;
//# sourceMappingURL=Section.js.map