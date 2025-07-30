import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { bgColors } from '../../website/colors';
const Section = ({ bg = bgColors.white.value, children, }) => {
    const bgColor = bg.className;
    return (_jsx("section", { className: classNames(bgColor, 'py-5 font-content'), children: children }));
};
export default Section;
//# sourceMappingURL=Section.js.map