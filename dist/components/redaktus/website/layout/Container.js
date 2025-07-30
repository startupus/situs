import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
const getWidthClass = (size) => {
    switch (size) {
        case 'lg': {
            return 'sm:w-11/12 xl:w-3/4 2xl:w-2/3';
        }
        case 'md': {
            return 'sm:w-11/12 lg:w-3/4 xl:w-2/3 2xl:w-7/12';
        }
        case 'sm': {
            return 'sm:w-2/3 lg:w-7/12';
        }
        case 'full': {
            return '';
        }
    }
};
const Container = ({ size = 'lg', className, children, }) => {
    return (_jsx("div", { className: classNames('mx-auto', { 'px-5': size !== 'full' }, getWidthClass(size), className), children: children }));
};
export default Container;
//# sourceMappingURL=Container.js.map