import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import { Text } from 'redaktus/core';
import * as types from 'redaktus/types';
import blockNames from '../blockNames';
const FormButton = ({ type, color }) => {
    return (_jsx("button", { type: type, className: clsx('py-3 px-5 mx-2 my-2 rounded-full font-bold leading-none translate-hover-2 hover:shadow-lg transition-all ease-in-out duration-150', color?.className), children: _jsx(Text, { propName: "buttonLabel", placeholder: "Type a button label...", renderBlock: ({ children }) => _jsx("span", { children: children }), renderPlaceholder: ({ children }) => (_jsx("span", { className: "block text-inherit", children: children })) }) }));
};
FormButton.schema = {
    name: blockNames.FormButton,
    label: 'Form Button',
    category: 'rb-ui website',
    hideFromAddMenu: true,
    getDefaultProps: () => ({
        type: 'submit',
        color: {
            color: '#0ea5e9',
            className: 'bg-sky-500 text-white hover:bg-sky-600 hover:text-white',
        },
        buttonLabel: [
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Submit',
                    },
                ],
            },
        ],
    }),
    sideEditProps: [
        {
            name: 'type',
            label: 'Type',
            type: types.SideEditPropType.Select,
            selectOptions: {
                display: types.OptionsDisplay.Radio,
                options: [
                    { value: 'submit', label: 'Submit' },
                    { value: 'reset', label: 'Reset' },
                ],
            },
        },
        {
            name: 'color',
            label: 'Color',
            type: types.SideEditPropType.Select,
            selectOptions: {
                display: types.OptionsDisplay.Color,
                options: [
                    {
                        value: {
                            color: '#0ea5e9',
                            className: 'bg-sky-500 text-white hover:bg-sky-600 hover:text-white',
                        },
                        label: 'Blue',
                    },
                    {
                        value: {
                            color: '#ec489a',
                            className: 'bg-pink-500 text-white hover:bg-pink-600 hover:text-white',
                        },
                        label: 'Pink',
                    },
                    {
                        value: {
                            color: '#6b7280',
                            className: 'bg-gray-500 text-white hover:bg-gray-600 hover:text-white',
                        },
                        label: 'Gray',
                    },
                ],
            },
        },
    ],
};
export default FormButton;
//# sourceMappingURL=FormButton.js.map