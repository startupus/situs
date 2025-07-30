import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
import { Repeater } from 'redaktus/core';
import * as types from 'redaktus/types';
import blockNames from '../blockNames';
const FormRadiobuttons = ({ register, fieldName, fieldLabel, isRequired, columns, }) => {
    return (_jsxs("div", { className: clsx('w-full px-2 py-1', columns === 'two' && 'col-span-2'), children: [_jsx("span", { className: "block text-gray-400 group-hover:text-indigo-600 font-medium uppercase tracking-widest text-sm peer-focus:text-indigo-700 mb-2", children: fieldLabel }), _jsx(Repeater, { propName: "radiobuttons", itemProps: {
                    fieldName,
                    register,
                    isRequired,
                } })] }));
};
FormRadiobuttons.schema = {
    name: blockNames.FormRadiobuttons,
    label: 'Form Radiobuttons',
    category: 'Tailblock Form',
    hideFromAddMenu: true,
    // Defaults when a new brick is added
    getDefaultProps: () => ({
        columns: 'one',
        fieldName: 'radiobuttonsField',
        fieldLabel: 'Radiobuttons Label',
        radiobuttons: [
            {
                label: 'Label single radio',
                value: 'value',
            },
        ],
        isRequired: false,
    }),
    repeaterItems: [
        {
            name: 'radiobuttons',
            label: 'Radiobuttons',
            itemType: blockNames.FormSingleRadio,
            min: 1,
        },
    ],
    // Sidebar Edit controls for props
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
            name: 'fieldLabel',
            type: types.SideEditPropType.Text,
            label: 'Field label',
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
export default FormRadiobuttons;
//# sourceMappingURL=FormRadiobuttons.js.map