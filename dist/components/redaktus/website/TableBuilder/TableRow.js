import { jsx as _jsx } from "react/jsx-runtime";
import { Repeater } from 'redaktus/core';
import blockNames from '../blockNames';
const TableRow = ({ index }) => {
    {
        return index === 0 ? (_jsx("thead", { children: _jsx("tr", { children: _jsx(Repeater, { propName: "cells", itemProps: {
                        isHeader: true,
                    } }) }) })) : (_jsx("tbody", { children: _jsx("tr", { children: _jsx(Repeater, { propName: "cells" }) }) }));
    }
};
TableRow.schema = {
    name: blockNames.TableRow,
    label: 'Row',
    category: 'Multilevel',
    hideFromAddMenu: true,
    // Defaults when a new brick is added
    getDefaultProps: () => ({
        cells: [
            {
                text: 'Cell',
            },
            {
                text: 'Cell',
            },
        ],
    }),
    repeaterItems: [
        {
            name: 'cells',
            label: 'Cells',
            itemType: blockNames.TableCell,
            min: 1,
        },
    ],
    // Sidebar Edit controls for props
    sideEditProps: [],
};
export default TableRow;
//# sourceMappingURL=TableRow.js.map