import { jsx as _jsx } from "react/jsx-runtime";
import { Repeater } from 'redaktus/core';
import blockNames from '../blockNames';
import Container from '../layout/Container';
import Section from '../layout/Section';
import { BackgroundColorsSideEditProps } from '../LayoutSideProps';
const Table = ({ bg }) => {
    return (_jsx(Section, { bg: bg, children: _jsx(Container, { size: "lg", className: "py-12 xl:py-20", children: _jsx("table", { className: "w-full", children: _jsx(Repeater, { propName: "rows" }) }) }) }));
};
Table.schema = {
    name: blockNames.Table,
    label: 'Table',
    category: 'rb-ui website',
    // Defaults when a new brick is added
    getDefaultProps: () => ({
        rows: [
            {
                cells: [
                    {
                        cellText: 'Cell text default',
                        text: 'Cell',
                    },
                    {
                        cellText: 'Cell text default',
                        text: 'Cell',
                    }
                ],
            },
            {
                cells: [
                    {
                        cellText: 'Cell text default',
                        text: 'Cell',
                    },
                    {
                        cellText: 'Cell text default',
                        text: 'Cell',
                    }
                ],
            },
            {
                cells: [
                    {
                        cellText: 'Cell text default',
                        text: 'Cell',
                    },
                    {
                        cellText: 'Cell text default',
                        text: 'Cell',
                    }
                ],
            }
        ],
    }),
    repeaterItems: [
        {
            name: 'rows',
            label: 'Rows',
            itemType: blockNames.TableRow,
            min: 1,
        }
    ],
    // Sidebar Edit controls for props
    sideEditProps: [
        BackgroundColorsSideEditProps
    ],
};
export default Table;
//# sourceMappingURL=Table.js.map