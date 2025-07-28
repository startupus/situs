import classNames from 'classnames'
import * as React from 'react'
import { Repeater, Text } from 'redaktus/core'
import * as types from 'redaktus/types'
import { useForm } from 'react-hook-form'
import blockNames from '../blockNames'
import Container from '../layout/Container'
import Section from '../layout/Section'
import { BackgroundColorsSideEditProps } from '../LayoutSideProps'

export interface FormBuilderProps {
  bg?: { color: string; className: string }
}

const FormBuilder: types.Brick<FormBuilderProps> = ({ bg }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  return (
    <Section bg={bg}>
      <Container size="lg" className="py-12 xl:py-20">
        <Text
          propName="formTitle"
          placeholder="Type a Title..."
          renderBlock={({ children }: { children: any }) => (
            <div className="flex justify-center">
              <h1 className="text-2xl w-auto font-medium text-gray-900 dark:text-white">
                {children}
              </h1>
            </div>
          )}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="py-4 max-w-2xl mx-auto px-8 grid grid-cols-2 gap-4"
        >
          <Repeater propName="form-elements" itemProps={{ register, errors }} />
          <Repeater
            propName="form-buttons"
            renderWrapper={(items: any) => (
              <div className="w-full flex justify-center space-x-6 col-span-2">
                {items}
              </div>
            )}
          />
        </form>
      </Container>
    </Section>
  )
}
const onSubmit = (values: any) => console.log(values)

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
}

export default FormBuilder
