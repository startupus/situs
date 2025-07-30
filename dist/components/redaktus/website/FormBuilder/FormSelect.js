import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as types from 'redaktus/types';
import clsx from 'clsx';
import blockNames from '../blockNames';
const FormSelect = ({ values, isRequired, register, fieldName = 'select', label, key, errors, requiredError, columns, }) => {
    return (_jsxs("label", { className: clsx('px-2 py-1 group block', columns === 'two' && 'col-span-2'), children: [_jsxs("span", { className: "block font-medium uppercase tracking-widest text-sm peer-focus:text-sky-700 transition-colors duration-200 text-gray-400 group-hover:text-sky-600 dark:text-gray-300 dark:group-hover:text-sky-300", children: [label, isRequired && _jsx("span", { className: "text-red-600 ml-2", children: "*" })] }), _jsx("select", { className: clsx('block w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-1 ring-sky-500 focus:shadow-sky-200 focus:shadow-lg transition-colors duration-200', 'border-gray-300 text-gray-900 focus:shadow-sky-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:shadow-sky-900'), ...register(fieldName?.replace(/\s/g, '').toLowerCase() || key), children: values?.split('\n').map((valuelabel, index) => {
                    const [value, label] = valuelabel.trim().split(':');
                    if (label) {
                        return (_jsx("option", { value: value, children: label.trim() }, index));
                    }
                    return (_jsx("option", { value: value, children: value }, index));
                }) }), errors[fieldName] && (_jsx("span", { className: "block mt-2 text-xs text-red-500 font-bold", children: errors[fieldName]?.type === 'required' && requiredError }))] }));
};
FormSelect.schema = {
    name: blockNames.FormSelect,
    label: 'Form Select',
    category: 'Tailblock Select',
    hideFromAddMenu: true,
    getDefaultProps: () => ({
        fieldName: 'selectField',
        label: 'Select Field Label',
        columns: 'two',
        values: 'value : Value',
        isRequired: false,
    }),
    sideEditProps: [
        {
            name: 'columns',
            label: 'Columns',
            type: types.SideEditPropType.Select,
            selectOptions: {
                display: types.OptionsDisplay.Radio,
                options: [
                    { value: 'one', label: 'One' },
                    { value: 'two', label: 'Two' },
                ],
            },
        },
        {
            name: 'fieldName',
            type: types.SideEditPropType.Text,
            label: 'Field Name',
        },
        {
            name: 'label',
            type: types.SideEditPropType.Text,
            label: 'Label',
        },
        {
            name: 'values',
            label: 'Value : Label',
            type: types.SideEditPropType.Textarea,
        },
        {
            name: 'isRequired',
            type: types.SideEditPropType.Boolean,
            label: 'Field required',
        },
        {
            name: 'requiredError',
            type: types.SideEditPropType.Text,
            label: 'Error required',
        },
    ],
};
export default FormSelect;
//# sourceMappingURL=FormSelect.js.map