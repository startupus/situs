import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as types from 'redaktus/types';
import blockNames from '../blockNames';
const FormSingleRadio = ({ register, fieldName, label, value, isRequired, key, }) => {
    return (_jsxs("label", { className: "block", children: [_jsx("input", { className: "accent-sky-500", ...register(fieldName?.replace(/\s/g, '').toLowerCase() || key), type: "radio", value: value }), _jsx("span", { className: "ml-2 text-gray-800 dark:text-gray-50", children: label })] }));
};
FormSingleRadio.schema = {
    name: blockNames.FormSingleRadio,
    label: 'Form Single Radio',
    category: 'Tailblock Form',
    hideFromAddMenu: true,
    // tags: [],
    // Defaults when a new brick is added
    getDefaultProps: () => ({
        label: 'Label single radio',
        value: 'value',
    }),
    // Sidebar Edit controls for props
    sideEditProps: [
        { name: 'label', type: types.SideEditPropType.Text, label: 'Label' },
        { name: 'value', type: types.SideEditPropType.Text, label: 'Value' },
    ],
};
export default FormSingleRadio;
//# sourceMappingURL=FormSingleRadio.js.map