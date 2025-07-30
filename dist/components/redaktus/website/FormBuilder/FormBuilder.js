import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Repeater, Text } from 'redaktus/core';
import { useForm } from 'react-hook-form';
import blockNames from '../blockNames';
import Container from '../layout/Container';
import Section from '../layout/Section';
import { BackgroundColorsSideEditProps } from '../LayoutSideProps';
const FormBuilder = ({ bg }) => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    return (_jsx(Section, { bg: bg, children: _jsxs(Container, { size: "lg", className: "py-12 xl:py-20", children: [_jsx(Text, { propName: "formTitle", placeholder: "Type a Title...", renderBlock: ({ children }) => (_jsx("div", { className: "flex justify-center", children: _jsx("h1", { className: "text-2xl w-auto font-medium text-gray-900 dark:text-white", children: children }) })) }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "py-4 max-w-2xl mx-auto px-8 grid grid-cols-2 gap-4", children: [_jsx(Repeater, { propName: "form-elements", itemProps: { register, errors } }), _jsx(Repeater, { propName: "form-buttons", renderWrapper: (items) => (_jsx("div", { className: "w-full flex justify-center space-x-6 col-span-2", children: items })) })] })] }) }));
};
const onSubmit = (values) => console.log(values);
FormBuilder.schema = {
    name: blockNames.FormBuilder,
    label: 'Form Builder',
    category: 'rb-ui website',
    repeaterItems: [
        {
            name: 'form-elements',
            label: 'Form Elements',
            itemType: blockNames.FormInput,
            itemLabel: 'Form Element',
            min: 0,
            max: 10,
        },
        {
            name: 'form-buttons',
            label: 'Form Buttons',
            itemType: blockNames.FormButton,
            itemLabel: 'Form Button',
            min: 0,
            max: 3,
        },
    ],
    getDefaultProps: () => ({
        bg: {
            color: '#fff',
            className: 'bg-white dark:bg-gray-900',
        },
        formTitle: [
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Form Title',
                    },
                ],
            },
        ],
        'form-elements': [
            {
                type: blockNames.FormInput,
                props: {
                    fieldName: 'inputField',
                    isRequired: false,
                    inputType: 'text',
                    columns: 'two',
                    label: 'Input Field',
                    requiredError: '',
                    pattern: '',
                    patternError: '',
                },
            },
        ],
    }),
    sideEditProps: [
        BackgroundColorsSideEditProps,
    ],
};
export default FormBuilder;
//# sourceMappingURL=FormBuilder.js.map