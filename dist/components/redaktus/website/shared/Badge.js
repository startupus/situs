import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { badgeColors } from '../colors';
import { Text } from 'redaktus/core';
import blockNames from '../blockNames';
import { BadgeColorsSideEditProps } from 'website/LayoutSideProps';
const Badge = ({ color = badgeColors.gray.value, className, }) => {
    return (_jsx("div", { className: "flex justify-center items-center", children: _jsx(Text, { renderBlock: (props) => (_jsx("span", { className: classNames('text-sm font-black uppercase text-center', color.className, className), style: { letterSpacing: '0.35em' }, children: props.children })), placeholder: "Badge...", propName: "text" }) }));
};
Badge.schema = {
    name: blockNames.Badge,
    label: 'Badge',
    category: 'rb-ui website',
    hideFromAddMenu: true,
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/shared/Badge.tsx',
    getDefaultProps: () => ({
        text: 'Special',
        color: badgeColors.gray.value,
    }),
    sideEditProps: [BadgeColorsSideEditProps],
};
export default Badge;
//# sourceMappingURL=Badge.js.map