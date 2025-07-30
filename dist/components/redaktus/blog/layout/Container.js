import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
const Container = ({ className, children }) => {
    return (_jsx("div", { className: classNames('max-w-2xl mx-auto', className), children: children }));
};
export default Container;
//# sourceMappingURL=Container.js.map