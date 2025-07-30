import * as types from 'redaktus/types';
import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
export interface FormCheckboxProps {
    register: UseFormRegister<any>;
    fieldName: string;
    label: string;
    isRequired: boolean;
    key: string;
    errors: FieldErrorsImpl<{
        [x: string]: any;
    }>;
    requiredError?: string;
    columns: 'one' | 'two';
}
declare const FormCheckbox: types.Brick<FormCheckboxProps>;
export default FormCheckbox;
//# sourceMappingURL=FormCheckbox.d.ts.map