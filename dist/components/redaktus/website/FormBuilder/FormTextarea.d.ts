import * as types from 'redaktus/types';
import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
export interface FormTextareaProps {
    register: UseFormRegister<any>;
    isRequired: boolean;
    fieldName?: string;
    label: string;
    key: string;
    errors: FieldErrorsImpl<{
        [x: string]: any;
    }>;
    requiredError?: string;
    columns: 'one' | 'two';
}
declare const FormTextarea: types.Brick<FormTextareaProps>;
export default FormTextarea;
//# sourceMappingURL=FormTextarea.d.ts.map