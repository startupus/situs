import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import { File } from 'redaktus/core';
import * as types from 'redaktus/types';
import { FiFile, FiFilePlus } from 'react-icons/fi';
import blockNames from '../blockNames';
const Document = ({ color }) => {
    return (_jsx("div", { className: classNames('flex justify-center bg-gray-50 border border-gray-200 rounded items-center py-2', color?.className), children: _jsx(File, { propName: "file", renderBlock: (file) => {
                return file ? (_jsxs("div", { className: "flex font-semibold h-full items-center", children: [_jsx(FiFile, { className: "mr-2" }), file.name, " - ", file.size.toFixed(2), "MB"] })) : (_jsxs("div", { className: "flex font-semibold h-full items-center", children: [_jsx(FiFilePlus, { className: "mr-2" }), "Add document"] }));
            } }) }));
};
Document.schema = {
    name: blockNames.Document,
    label: 'Document',
    category: 'rb-ui website',
    hideFromAddMenu: true,
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Documents/Document.tsx',
    getDefaultProps: () => ({
        file: {
            name: 'Redaktus Website.pdf',
            size: 521.929,
            url: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+File'
        },
    }),
    sideEditProps: [
        {
            name: 'color',
            label: 'Color',
            type: types.SideEditPropType.Select,
            selectOptions: {
                display: types.OptionsDisplay.Color,
                options: [
                    {
                        value: {
                            color: '#c6f6d5',
                            className: 'bg-green-100 dark:bg-gray-800',
                        },
                        label: 'Green',
                    },
                ],
            },
        },
    ],
};
export default Document;
//# sourceMappingURL=Document.js.map