import * as types from 'redaktus/types';
import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
export interface FormInputProps {
    register: UseFormRegister<any>;
    errors: FieldErrorsImpl<{
        [x: string]: any;
    }>;
    fieldName?: string;
    label?: string;
    isRequired: boolean;
    inputType: 'text' | 'number' | 'date';
    key: string;
    pattern?: string;
    patternError?: string;
    requiredError?: string;
    columns: 'one' | 'two';
}
declare const FormInput: types.Brick<FormInputProps>;
export default FormInput;
//# sourceMappingURL=FormInput.d.ts.map