import * as types from 'redaktus/types';
import { UseFormRegister } from 'react-hook-form';
export interface FormSingleRadioProps {
    register: UseFormRegister<any>;
    fieldName?: string;
    label: string;
    value: string;
    isRequired: boolean;
    key: string;
}
declare const FormSingleRadio: types.Brick<FormSingleRadioProps>;
export default FormSingleRadio;
//# sourceMappingURL=FormSingleRadio.d.ts.map