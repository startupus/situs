import { jsx as _jsx } from "react/jsx-runtime";
const Link = ({ href, children, ...props }) => {
    return (_jsx("a", { href: href, ...props, children: children }));
};
export default Link;
//# sourceMappingURL=link.js.map