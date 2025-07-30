import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
const TableStack = ({ title = 'Users List', items, className, onItemClick, }) => {
    return (_jsx("section", { className: cn('relative z-10 overflow-hidden bg-white py-20 lg:py-[100px]', className), children: _jsx("div", { className: "container mx-auto", children: _jsx(TableStackWrapper, { title: title, children: items.map((item) => (_jsx(StackItem, { item: item, onClick: () => onItemClick?.(item) }, item.id))) }) }) }));
};
const TableStackWrapper = ({ title, children, }) => {
    return (_jsxs(_Fragment, { children: [_jsx("h3", { className: "mb-8 text-2xl font-medium text-black sm:text-[28px]", children: title }), _jsx("div", { className: "border-stroke max-w-[370px] border bg-white py-[10px]", children: children })] }));
};
const StackItem = ({ item, onClick, }) => {
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
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'text-success';
            case 'inactive':
                return 'text-danger';
            case 'pending':
                return 'text-warning';
            default:
                return 'text-body-color';
        }
    };
    return (_jsxs("div", { className: "flex items-center justify-between py-[18px] pl-6 pr-4 hover:bg-[#F5F5F5] cursor-pointer", onClick: onClick, children: [_jsxs("div", { className: "flex items-center", children: [item.image && (_jsx("div", { className: "mr-[18px] h-[50px] w-full max-w-[50px] overflow-hidden rounded-full", children: _jsx("img", { src: item.image, alt: item.name, className: "rounded-full object-cover object-center" }) })), _jsxs("div", { children: [_jsx("h4", { className: "text-base font-medium text-black", children: item.name }), item.position && (_jsx("p", { className: "text-body-color text-base", children: item.position })), item.email && (_jsx("p", { className: "text-sm text-body-color", children: item.email })), item.status && (_jsx("span", { className: cn('text-sm font-medium', getStatusColor(item.status)), children: item.status }))] })] }), _jsx("div", { children: item.actions || (_jsx(Dropdown, { trigger: trigger, dropdown: dropdown, dropdownOpen: dropdownOpen, setDropdownOpen: setDropdownOpen })) })] }));
};
const Dropdown = ({ trigger, dropdown, dropdownOpen, setDropdownOpen }) => {
    return (_jsxs("div", { className: "relative", children: [_jsx("button", { ref: trigger, onClick: () => setDropdownOpen(!dropdownOpen), className: "flex items-center space-x-1 text-body-color hover:text-dark", children: _jsx("span", { className: "text-lg", children: "\u22EF" }) }), dropdownOpen && (_jsxs("div", { ref: dropdown, className: "absolute right-0 top-full z-40 mt-2 w-32 rounded-md border border-stroke bg-white py-2 shadow-lg", children: [_jsx("button", { className: "block w-full px-4 py-2 text-left text-sm text-body-color hover:bg-gray-100", children: "Edit" }), _jsx("button", { className: "block w-full px-4 py-2 text-left text-sm text-body-color hover:bg-gray-100", children: "Delete" })] }))] }));
};
export default TableStack;
//# sourceMappingURL=TableStack.js.map