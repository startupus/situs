import * as types from 'redaktus/types';
import { FieldErrorsImpl, UseFormRegister } from 'react-hook-form';
export interface FormSelectProps {
    register: UseFormRegister<any>;
    fieldName?: string;
    label: string;
    values?: string;
    isRequired: boolean;
    key: string;
    errors: FieldErrorsImpl<{
        [x: string]: any;
    }>;
    requiredError?: string;
    columns: 'one' | 'two';
}
declare const FormSelect: types.Brick<FormSelectProps>;
export default FormSelect;
//# sourceMappingURL=FormSelect.d.ts.map