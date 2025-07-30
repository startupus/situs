import { jsx as _jsx } from "react/jsx-runtime";
import blockNames from '../blockNames';
import Container from 'website/layout/Container';
import Section from 'website/layout/Section';
import { BackgroundColorsSideEditProps, ContainerSizeSideEditProps, } from 'website/LayoutSideProps';
const HorizontalRule = ({ width, bg }) => {
    return (_jsx(Section, { bg: bg, className: "py-4", children: _jsx(Container, { size: width, children: _jsx("hr", {}) }) }));
};
HorizontalRule.schema = {
    name: blockNames.HorizontalRule,
    label: 'Horizontal Rule',
    category: 'rb-ui website',
    sideEditProps: [
        BackgroundColorsSideEditProps, ContainerSizeSideEditProps
    ],
};
export default HorizontalRule;
//# sourceMappingURL=HorizontalRule.js.map