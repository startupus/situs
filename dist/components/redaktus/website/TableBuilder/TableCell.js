import { jsx as _jsx } from "react/jsx-runtime";
import { Text } from 'redaktus/core';
import blockNames from '../blockNames';
const TableCell = ({ isHeader }) => {
    return isHeader ? (_jsx("th", { className: "px-4 py-3 bg-gray-100 dark:bg-gray-800 text-left", children: _jsx(Text, { propName: "cellText", placeholder: "Insert text", renderBlock: ({ children }) => (_jsx("span", { className: "title-font tracking-wider font-medium text-gray-900 dark:text-white text-sm", children: children })) }) })) : (_jsx("td", { className: "px-4 py-3 border-b-2 border-gray-200", children: _jsx(Text, { propName: "cellText", placeholder: "Insert text", renderBlock: ({ children }) => _jsx("span", { children: children }) }) }));
};
TableCell.schema = {
    name: blockNames.TableCell,
    label: 'Cell',
    category: 'Multilevel',
    hideFromAddMenu: true,
    // Defaults when a new brick is added
    getDefaultProps: () => ({
        cellText: 'Cell text default',
    }),
    // Sidebar Edit controls for props
    sideEditProps: [],
};
export default TableCell;
//# sourceMappingURL=TableCell.js.map