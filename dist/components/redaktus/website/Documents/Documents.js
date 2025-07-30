import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { Repeater } from 'redaktus/core';
import { BackgroundColorsSideEditProps, ContainerSizeSideEditProps, } from 'website/LayoutSideProps';
import blockNames from '../blockNames';
import Container from '../layout/Container';
import Section from '../layout/Section';
const Documents = ({ bg, width }) => {
    return (_jsx(Section, { bg: bg, children: _jsx(Container, { size: width, className: classNames('py-12 flex flex-wrap justify-center items-center'), children: _jsx(Repeater, { propName: "files", renderWrapper: (items) => (_jsx("ul", { className: "w-full p-6 grid grid-cols-3 gap-6 ", children: items })), renderItemWrapper: (item) => _jsx("li", { children: item }) }) }) }));
};
Documents.schema = {
    name: blockNames.Documents,
    label: 'Documents',
    category: 'rb-ui website',
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Documents/Documents.tsx',
    getDefaultProps: () => ({
        files: [
            {
                file: {
                    name: 'Redaktus Setup Instructions',
                    size: 234.321,
                    url: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+File'
                },
            },
            {
                file: {
                    name: 'Redaktus License',
                    size: 12.456,
                    url: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+File'
                },
            },
            {
                file: {
                    name: 'Redaktus Roadmap',
                    size: 98.765,
                    url: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+File'
                },
            },
        ],
    }),
    sideEditProps: [BackgroundColorsSideEditProps, ContainerSizeSideEditProps],
    repeaterItems: [
        {
            name: 'files',
            label: 'Files',
            itemType: blockNames.Document,
            itemLabel: 'Document',
        },
    ],
};
export default Documents;
//# sourceMappingURL=Documents.js.map