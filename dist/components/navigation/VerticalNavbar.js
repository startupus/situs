import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
const VerticalNavbar = ({ logo, items, userProfile, className, onItemClick, }) => {
    return (_jsx("section", { className: cn('h-screen bg-gray-2', className), children: _jsxs("div", { className: "flex h-screen w-full max-w-[300px] flex-col justify-between overflow-y-scroll bg-white shadow-card", children: [_jsxs("div", { children: [logo && (_jsx("div", { className: "px-10 pt-10 pb-9", children: _jsx("a", { href: "/", children: _jsx("img", { src: logo.src, alt: logo.alt }) }) })), _jsx("nav", { children: _jsx("ul", { children: items.map((item, index) => (_jsx(NavItemComponent, { item: item, onClick: () => onItemClick?.(item) }, item.id))) }) })] }), userProfile && (_jsx("div", { className: "p-10", children: _jsxs("div", { className: "flex items-center", children: [userProfile.avatar && (_jsx("div", { className: "mr-4 h-[50px] w-full max-w-[50px] rounded-full", children: _jsx("img", { src: userProfile.avatar, alt: userProfile.name, className: "h-full w-full rounded-full object-cover object-center" }) })), _jsxs("div", { children: [_jsx("h6", { className: "text-base font-medium text-body-color", children: userProfile.name }), _jsx("p", { className: "text-sm text-body-color", children: userProfile.email })] })] }) }))] }) }));
};
const NavItemComponent = ({ item, onClick, }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef(null);
    const dropdown = useRef(null);
    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current)
                return;
            if (!dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current?.contains(target))
                return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [dropdownOpen]);
    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27)
                return;
            setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    }, [dropdownOpen]);
    const handleClick = (e) => {
        if (item.submenu) {
            e.preventDefault();
            setDropdownOpen(!dropdownOpen);
        }
        else {
            onClick?.();
        }
    };
    return (_jsxs("li", { className: "relative", children: [_jsxs("a", { href: item.href || '#', ref: trigger, onClick: handleClick, className: cn('flex items-center px-10 py-3 text-base font-medium text-body-color transition-all duration-300 hover:bg-primary hover:text-white', dropdownOpen && 'bg-primary text-white'), children: [item.icon && _jsx("span", { className: "mr-3", children: item.icon }), item.label, item.submenu && (_jsx("span", { className: "ml-auto", children: _jsx("svg", { className: cn('h-4 w-4 transition-transform duration-200', dropdownOpen && 'rotate-180'), fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) }))] }), item.submenu && dropdownOpen && (_jsx("ul", { ref: dropdown, className: "absolute left-0 top-full z-40 w-full bg-white shadow-lg", children: item.submenu.map((subItem) => (_jsx(DropdownItem, { item: subItem }, subItem.id))) }))] }));
};
const DropdownItem = ({ item }) => {
    return (_jsx("li", { children: _jsxs("a", { href: item.href || '#', className: "block px-10 py-2 text-sm text-body-color transition-all duration-300 hover:bg-primary hover:text-white", onClick: item.onClick, children: [item.icon && _jsx("span", { className: "mr-3", children: item.icon }), item.label] }) }));
};
export default VerticalNavbar;
//# sourceMappingURL=VerticalNavbar.js.map