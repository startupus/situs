import { jsx as _jsx } from "react/jsx-runtime";
import { Link as RouterLink, useLocation } from 'react-router-dom';
const NextLink = ({ href, 
// target,
// rel,
className, activeClassName, children, }) => {
    const location = useLocation();
    let anchorClassName = '';
    if (location.pathname === href) {
        anchorClassName = `${className} ${activeClassName}`;
    }
    else {
        anchorClassName = className || "";
    }
    return (_jsx(RouterLink, { to: href, className: anchorClassName, children: children }));
};
export default NextLink;
//# sourceMappingURL=NextLink.js.map