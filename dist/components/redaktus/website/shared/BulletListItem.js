import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import { FiCheck } from 'react-icons/fi';
import { Text } from 'redaktus/core';
import { bulletColors } from '../colors';
import blockNames from '../blockNames';
import { BulletColorsSideEditProps } from 'website/LayoutSideProps';
const BulletListItem = ({ color = bulletColors.pinkLight.value, className, }) => {
    return (_jsxs("div", { className: classNames('flex justify-start items-center py-2 leading-tight', className), children: [_jsx("div", { className: classNames('flex justify-center items-center w-5 h-5 rounded-full mr-4 text-sm', color.className), style: { minWidth: '1.25rem' }, children: _jsx(FiCheck, {}) }), _jsx(Text, { propName: "text", renderBlock: (props) => (_jsx("span", { className: classNames('dark:text-gray-100', color.className2), ...props.attributes, children: props.children })), placeholder: "Type..." })] }));
};
BulletListItem.schema = {
    name: blockNames.BulletListItem,
    label: 'List item',
    category: 'rb-ui website',
    hideFromAddMenu: true,
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/shared/BulletListItem.tsx',
    getDefaultProps: () => ({
        color: bulletColors.pinkLight.value,
        text: 'New item',
    }),
    sideEditProps: [BulletColorsSideEditProps],
};
export default BulletListItem;
//# sourceMappingURL=BulletListItem.js.map